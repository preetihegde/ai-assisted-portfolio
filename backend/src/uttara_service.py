from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from backend.src.rest_service import retrieve_vector_data
from backend.src.utility_service import get_groq_model_parameters, get_session_history, format_docs, get_file_paths, load_system_prompt


# working_dir = os.path.dirname(os.path.abspath(__file__))
# parent_dir = os.path.dirname(working_dir)

# utility_service.py


def ask_question(question: str, session_id: str) -> str:
    file_paths= get_file_paths()
    vector_db_path = file_paths['vector_db_path']
    retrieved_vector_data = retrieve_vector_data(vector_db_path)
    llm = get_groq_model_parameters()

    retriever = retrieved_vector_data.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 3}
    )



    prompt = ChatPromptTemplate.from_messages([
        ("system", load_system_prompt()),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{question}"),
    ])


    # Core chain: retrieve → format → prompt → llm → parse
    chain = (
            {
                "context": (lambda x: x["question"]) | retriever | format_docs,
                "question": RunnablePassthrough() | (lambda x: x["question"]),
                "chat_history": RunnablePassthrough() | (lambda x: x.get("chat_history", [])),
            }
            | prompt
            | llm
            | StrOutputParser()
    )

    # Wrap with message history for session memory
    chain_with_history = RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="question",
        history_messages_key="chat_history",
    )

    response = chain_with_history.invoke(
        {"question": question},
        config={"configurable": {"session_id": session_id}},
    )

    return response
# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from langchain_core.runnables.history import RunnableWithMessageHistory
# from langchain_core.output_parsers import StrOutputParser
# from langchain_core.runnables import RunnablePassthrough, RunnableLambda
#
# from src.rest_service import retrieve_vector_data
# from src.utility_service import (
#     get_groq_model_parameters,
#     get_session_history,
#     format_docs,
#     get_file_paths,
#     load_system_prompt
# )
#
#
# def ask_question(question: str, session_id: str) -> str:
#     file_paths = get_file_paths()
#     vector_db_path = file_paths["vector_db_path"]
#     retrieved_vector_data = retrieve_vector_data(vector_db_path)
#     llm = get_groq_model_parameters()
#
#     retriever = retrieved_vector_data.as_retriever(
#         search_type="mmr",
#         search_kwargs={"k": 6, "fetch_k": 15, "lambda_mult": 0.6},
#     )
#
#     print(load_system_prompt())
#     prompt = ChatPromptTemplate.from_messages(
#         [
#             ("system", load_system_prompt()),
#             MessagesPlaceholder(variable_name="chat_history"),
#             ("human", "{question}"),
#         ]
#     )
#
#     # RunnableWithMessageHistory injects chat_history into the chain inputs
#     # BEFORE the prompt renders — but only if the chain dict passes it through.
#     # Without explicitly passing chat_history here, the prompt errors with KeyError.
#
#
#     chain = (
#             {
#                 "context": RunnableLambda(lambda x: x["question"]) | retriever | format_docs,
#                 "question": RunnableLambda(lambda x: x["question"]),
#                 "chat_history": RunnableLambda(lambda x: x.get("chat_history", [])),
#             }
#             | prompt
#             | llm
#             | StrOutputParser()
#     )
#
#     chain_with_history = RunnableWithMessageHistory(
#         chain,
#         get_session_history,
#         input_messages_key="question",
#         history_messages_key="chat_history",
#     )
#
#     response = chain_with_history.invoke(
#         {"question": question},
#         config={"configurable": {"session_id": session_id}},
#     )
#
#
#
#     return response



from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda

from src.rest_service import get_vector_store
from src.utility_service import (
    get_groq_model_parameters,
    get_session_history,
    format_docs,
    load_system_prompt
)


def retrieve_and_debug(question, retriever):
    docs = retriever.invoke(question)

    print("\n" + "=" * 100)
    print(f"QUESTION: {question}")
    print("=" * 100)

    for i, doc in enumerate(docs):
        print(f"\n===== DOCUMENT {i + 1} =====")
        print(doc.page_content[:2000])

        if doc.metadata:
            print("\nMetadata:", doc.metadata)

    print("\n" + "=" * 100)

    return format_docs(docs)


def ask_question(question: str, session_id: str) -> str:

    retrieved_vector_data = get_vector_store()

    llm = get_groq_model_parameters()

    retriever = retrieved_vector_data.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": 8,
            "fetch_k": 25,
            "lambda_mult": 0.6
        },
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", load_system_prompt()),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{question}"),
        ]
    )

    chain = (
            {
                "context": RunnableLambda(
                    lambda x: retrieve_and_debug(
                        x["question"],
                        retriever
                    )
                ),
                "question": RunnableLambda(
                    lambda x: x["question"]
                ),
                "chat_history": RunnableLambda(
                    lambda x: x.get("chat_history", [])
                ),
            }
            | prompt
            | llm
            | StrOutputParser()
    )

    chain_with_history = RunnableWithMessageHistory(
        chain,
        get_session_history,
        input_messages_key="question",
        history_messages_key="chat_history",
    )

    response = chain_with_history.invoke(
        {"question": question},
        config={
            "configurable": {
                "session_id": session_id
            }
        },
    )

    return response
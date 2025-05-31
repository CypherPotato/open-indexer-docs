# Sentinel Agents

The Sentinel chat agents are models with optimized parameters for real-time chat conversation, with instructions that enhance the model's attention to specific tasks and allow for real-time internet research.

These models are constantly updated to utilize the latest technologies and resources available through generative AI, so the internal models used by the Sentinel models can be constantly updated.

Currently, the Sentinel models are available in three categories:

- **sentinel**: always uses a highly intelligent model, with deep thinking features, to answer the user's questions. Recommended for conversations that require reasoning about complex situations and details that need to be taken into account.
- **sentinel-mini**: uses a model with deep thinking, but configured to think less than the `/sentinel`, to maintain a balance between intelligence and resolution of complex tasks.
- **sentinel-core**: does not have deep thinking, but has other conversation resources, internet research, and advanced understanding of the user's problem.

Whenever a Sentinel model is to have its price changed, a notification is sent to all users who use the model and a notification is added to the notifications page.

These models should be used for conversation with the end user and are not recommended for other tasks such as using functions, structured responses, etc.

## Main Features

The differential of the Sentinel models are the resources provided "out-of-the-box" by them, including:

- **Optimized for chat**: the Sentinel models have clear instructions that make the model adapt the tone of the conversation to that of the user, indicators of humor and objective.
- **Internet research**: the Sentinel models can naturally search the internet to complement their response in different scenarios, such as obtaining local news, weather data, or data on a specific topic or niche.
- **Accessing links**: the Sentinel models can access files and pages provided by the user. It can access HTML pages, various text files, even Word and PDF documents.
- **Code execution**: the Sentinel models can execute code to perform mathematical, financial, or other tasks to help the user.
- **Persistent memory**: the Sentinel models can identify relevant facts to the user that should be persisted during several conversations, even after the current conversation is cleared or renewed.

Additionally, all Sentinel models have a chain of execution of functions. For example, you can ask a Sentinel model to access the temperature of a city, convert it to JSON, and call an external URL with the response.

## Sentinel Router

You can also use the **sentinel-router** routing model, which works as a router model between the three models. A router automatically chooses which model is best to solve the user's problem based on the complexity of their problem.

How does it work? A smaller model analyzes the context of the question and evaluates the degree of complexity that the user is facing, and that model responds with an indicator of which model is best to answer that question. The router decides which model is best per message and not per conversation.

A routing model can help reduce costs and maintain the quality of the conversation, using deep thinking resources only when necessary.
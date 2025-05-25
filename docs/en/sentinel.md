# Sentinel Agents

The Sentinel chat agents are models with optimized parameters for real-time chat conversation, with instructions that enhance the model's attention to specific tasks and allow for real-time internet research.

These models are constantly updated to utilize the latest technologies and features available through generative AI, so the internal models used by the Sentinel models can be constantly updated.

All Sentinel models perform internet research when possible. These models do not have a predefined name, so you can adjust the model name, as well as its personality, with system instructions.

Currently, the Sentinel models are available in three categories:

- **sentinel**: always uses a highly intelligent model, with deep thinking features, to respond to user questions. Recommended for conversations that require reasoning about complex situations and details that need to be taken into account.
- **sentinel-mini**: uses a model with deep thinking, but configured to think less than the `/sentinel`, to maintain a balance between intelligence and resolution of complex tasks.
- **sentinel-core**: does not have deep thinking, but has other conversation features, internet research, and advanced understanding of the user's problem.

Whenever a Sentinel model is to have its price changed, a notification is sent to all users who use the model and a notification is added to the notifications page.

These models should be used for conversation with the end-user and are not recommended for other tasks such as using functions, structured responses, etc.

## Sentinel Router

You can also use the **sentinel-router** routing model, which works as a routing model between the three models. A router automatically chooses the best model to solve the user's problem based on the complexity of their problem.

How does it work? A smaller model analyzes the context of the question and evaluates the degree of complexity the user is facing, and this model responds with an indicator of which model is best to answer that question. The router decides which is the best model per message and not per conversation.

A routing model can help reduce costs and maintain conversation quality, using deep thinking features when necessary.
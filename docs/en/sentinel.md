# Agents Sentinel

The Sentinel chat agents are models with optimized parameters for real-time chat conversation, with instructions that enhance the model's attention to specific tasks and allow for real-time internet research.

These models are constantly updated to utilize the latest technologies and resources available through generative AI, so the internal models used by the Sentinel models can be constantly updated.

Currently, the Sentinel models are available in three categories:

- **sentinel**: highly intelligent. It uses the model's own deep thinking to complement the response.
- **sentinel-mini**: intelligent and capable for most complex chat tasks.
- **sentinel-core**: cost-optimized model, with lower conversation capability, but with Sentinel reasoning.

Whenever a Sentinel model is to have its price changed, a notification is sent to all users who use the model and a notification is added to the notifications page.

These models should be used for conversation with the end-user and are not recommended for other tasks such as using functions, structured responses, etc.

## Main Features

The differential of the Sentinel models are the resources provided "out-of-the-box" by them, including:

- **Optimized for chat**: the Sentinel models have clear instructions that make the model adapt the tone of conversation to that of the user, humor indicators, and objectives.
- **Reasoning**: all Sentinel models have a customized deep thinking mechanism, optimized to reason based on their provided functions, including [protocol functions](/docs/en/protocol-functions), to provide a detailed response to the user.
- **Internet research**: the Sentinel models can naturally research the internet to complement their response in different scenarios, such as obtaining local news, weather data, or data on a specific topic or niche.
- **Access links**: the Sentinel models can access files and pages provided by the user. It can access HTML pages, various text files, even Word and PDF documents.
- **Code execution**: the Sentinel models can execute code to perform mathematical, financial calculations, or even help the user with various tasks.
- **Persistent memory**: the Sentinel models can identify relevant facts to the user that should be persisted during multiple conversations, even after the current conversation is cleared or renewed.

Additionally, all Sentinel models have a function execution chain. For example, you can ask a Sentinel model to access the temperature of a city, convert it to JSON, and call an external URL with the response.

> [!NOTE]
>
> Important: the Sentinel context includes a detailed description of its behavior and functions and occupies approximately **~1.300** tokens that will be appended to all messages sent by the user.

## Sentinel Router

You can also use the **sentinel-router** routing model, which works as a router model between the Sentinel models. A router automatically chooses which model is best to solve the user's problem based on the complexity of their problem.

How does it work? A smaller model analyzes the context of the question and evaluates the degree of complexity the user is facing, and this model responds with an indicator of which model is best to answer that question. The router decides which model is best per message and not per conversation.

A routing model can help reduce costs and maintain conversation quality, using deep thinking resources only when necessary.

## Sentinel Lambda

The `sentinel-lambda` agent is optimized for use in [JSON functions](/entities/functions), being able to research the internet, execute code, and access links, which further improves the accuracy of intelligent function execution.

## Sentinel Reasoning

The Sentinel's deep thinking mechanism is a plug-and-play reasoning engine that provides all the necessary context for the Sentinel model to respond to the user's question. During the thinking process, Sentinel calls functions, performs calculations, and executes code, aiming to provide an elaborate and accurate response to the user, even when used with smaller and less intelligent models.

The pricing of Sentinel reasoning and Sentinel tokens are separate: you will notice that when using the Sentinel model, you will see launches of routing, reasoning, and inference. This division is made to provide transparency about the use of Sentinel.

This reasoning process is not a complete reasoning process of a model, but rather an algorithm made to plan the execution of a task solution through the [protocol functions](/protocol-functions) provided to the model. The `@aivax/sentinel` agent combines the use of the two reasoning processes: Sentinel and the model's own, which creates an even more elaborate response for the user.
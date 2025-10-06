# Models

AIVAX provides models from different providers to make development even faster, eliminating the need to configure an account for each provider to access their latest models.

See the list below of available models and their pricing. All prices consider the total input and output tokens, with or without cache.

All prices are in United States dollars.

## <img src="/assets/icon/amazon.svg" class="inline-icon"> amazon

<table>
    <thead>
        <colgroup>
            <col style="width: 30%" />
            <col style="width: 20%" />
            <col style="width: 50%" />
        </colgroup>
        <tr>
            <th>Model name</th>
            <th>Pricing</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
<tr>
    <td>
        <code>
            @amazon/nova-pro
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.80 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 3.20 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        A highly capable multimodal model with the best combination of accuracy, speed, and cost for a wide range of tasks.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images, videos
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-lightbulb-line"></i>
    Reasoning
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @amazon/nova-lite
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.06 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 0.24 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        A very low cost multimodal model that is lightning fast for processing image, video, and text inputs.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images, videos
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-lightbulb-line"></i>
    Reasoning
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @amazon/nova-micro
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.04 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 0.14 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        A text-only model that delivers the lowest latency responses at very low cost.
        <div class="model-capabilities">
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
    </tbody>
</table>

## <img src="/assets/icon/anthropic.svg" class="inline-icon"> anthropic

<table>
    <thead>
        <colgroup>
            <col style="width: 30%" />
            <col style="width: 20%" />
            <col style="width: 50%" />
        </colgroup>
        <tr>
            <th>Model name</th>
            <th>Pricing</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
<tr>
    <td>
        <code>
            @anthropic/claude-4.5-sonnet
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 3.00 <small>/1m tokens</small>
            </div>
        </div>
        <div class="item-pricing">
    <small>
        Input (cached):
    </small>
    <div>
        $ 0.30 <small>/1m tokens</small>
    </div>
</div>
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 15.00 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Claude Sonnet 4.5 is the newest model in the Sonnet series, offering improvements and updates over Sonnet 4.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-lightbulb-line"></i>
    Reasoning
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @anthropic/claude-4-sonnet
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 3.00 <small>/1m tokens</small>
            </div>
        </div>
        <div class="item-pricing">
    <small>
        Input (cached):
    </small>
    <div>
        $ 0.30 <small>/1m tokens</small>
    </div>
</div>
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 15.00 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Anthropic's mid-size model with superior intelligence for high-volume uses in coding, in-depth research, agents, & more.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-lightbulb-line"></i>
    Reasoning
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @anthropic/claude-3.5-haiku
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.80 <small>/1m tokens</small>
            </div>
        </div>
        <div class="item-pricing">
    <small>
        Input (cached):
    </small>
    <div>
        $ 0.08 <small>/1m tokens</small>
    </div>
</div>
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 4.00 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Claude 3.5 Haiku is the next generation of our fastest model. For a similar speed to Claude 3 Haiku, Claude 3.5 Haiku improves across every skill set and surpasses Claude 3 Opus, the largest model in our previous generation, on many intelligence benchmarks.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @anthropic/claude-3-haiku
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.25 <small>/1m tokens</small>
            </div>
        </div>
        <div class="item-pricing">
    <small>
        Input (cached):
    </small>
    <div>
        $ 0.03 <small>/1m tokens</small>
    </div>
</div>
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 1.25 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Claude 3 Haiku is Anthropic's fastest model yet, designed for enterprise workloads which often involve longer prompts.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
    </tbody>
</table>

## <img src="/assets/icon/cohere.svg" class="inline-icon"> cohere

<table>
    <thead>
        <colgroup>
            <col style="width: 30%" />
            <col style="width: 20%" />
            <col style="width: 50%" />
        </colgroup>
        <tr>
            <th>Model name</th>
            <th>Pricing</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
<tr>
    <td>
        <code>
            @cohere/command-a
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 2.50 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 10.00 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Command A is Cohere's most performant model to date, excelling at tool use, agents, retrieval augmented generation (RAG), and multilingual use cases. Command A has a context length of 256K, only requires two GPUs to run, and has 150% higher throughput compared to Command R+ 08-2024.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
    </tbody>
</table>

## <img src="/assets/icon/deepseekai.svg" class="inline-icon"> deepseekai

<table>
    <thead>
        <colgroup>
            <col style="width: 30%" />
            <col style="width: 20%" />
            <col style="width: 50%" />
        </colgroup>
        <tr>
            <th>Model name</th>
            <th>Pricing</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
<tr>
    <td>
        <code>
            @deepseekai/r1
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.50 <small>/1m tokens</small>
            </div>
        </div>
        <div class="item-pricing">
    <small>
        Input (cached):
    </small>
    <div>
        $ 0.40 <small>/1m tokens</small>
    </div>
</div>
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 2.15 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        The DeepSeek R1 model has undergone a minor version upgrade, with the current version being DeepSeek-R1-0528.
        <div class="model-capabilities">
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-lightbulb-line"></i>
    Reasoning
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @deepseekai/v3.1-terminus
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.27 <small>/1m tokens</small>
            </div>
        </div>
        <div class="item-pricing">
    <small>
        Input (cached):
    </small>
    <div>
        $ 0.22 <small>/1m tokens</small>
    </div>
</div>
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 1.00 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        DeepSeek-V3.1 is post-trained on the top of DeepSeek-V3.1-Base, which is built upon the original V3 base checkpoint through a two-phase long context extension approach, following the methodology outlined in the original DeepSeek-V3 report.
        <div class="model-capabilities">
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-lightbulb-line"></i>
    Reasoning
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @deepseekai/v3.2
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.27 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 0.40 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        DeepSeek-V3.2-Exp is an intermediate step toward the next-generation architecture of the DeepSeek models by introducing DeepSeek Sparse Attention—a sparse attention mechanism designed to explore and validate optimizations for training and inference efficiency in long-context scenarios.
        <div class="model-capabilities">
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-lightbulb-line"></i>
    Reasoning
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
    </tbody>
</table>

## <img src="/assets/icon/google.svg" class="inline-icon"> google

<table>
    <thead>
        <colgroup>
            <col style="width: 30%" />
            <col style="width: 20%" />
            <col style="width: 50%" />
        </colgroup>
        <tr>
            <th>Model name</th>
            <th>Pricing</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
<tr>
    <td>
        <code>
            @google/gemini-2.5-pro
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 1.25 <small>/1m tokens</small>
            </div>
        </div>
        <div class="item-pricing">
    <small>
        Input (cached):
    </small>
    <div>
        $ 0.31 <small>/1m tokens</small>
    </div>
</div>
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 10.00 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        One of the most powerful models today.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images, videos, audio
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-lightbulb-line"></i>
    Reasoning
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @google/gemini-2.5-flash
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.30 <small>/1m tokens</small>
            </div>
        </div>
        <div class="item-pricing">
    <small>
        Input (cached):
    </small>
    <div>
        $ 0.08 <small>/1m tokens</small>
    </div>
</div>
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 2.50 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Google's best model in terms of price-performance, offering well-rounded capabilities. 2.5 Flash is best for large scale processing, low-latency, high volume tasks that require thinking, and agentic use cases.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images, videos, audio
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-lightbulb-line"></i>
    Reasoning
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @google/gemini-2.5-flash-lite
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.10 <small>/1m tokens</small>
            </div>
        </div>
        <div class="item-pricing">
    <small>
        Input (cached):
    </small>
    <div>
        $ 0.03 <small>/1m tokens</small>
    </div>
</div>
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 0.40 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        A Gemini 2.5 Flash model optimized for cost efficiency and low latency.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images, videos, audio
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-lightbulb-line"></i>
    Reasoning
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @google/gemini-2.0-flash
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.10 <small>/1m tokens</small>
            </div>
        </div>
        <div class="item-pricing">
    <small>
        Input (cached):
    </small>
    <div>
        $ 0.03 <small>/1m tokens</small>
    </div>
</div>
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 0.40 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Gemini 2.0 Flash delivers next-gen features and improved capabilities, including superior speed, native tool use, and a 1M token context window.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images, videos, audio
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @google/gemini-2.0-flash-lite
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.08 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 0.30 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        General-purpose model, with image recognition, smart and fast. Great for an economical chat.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images, videos, audio
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
    </tbody>
</table>

## <img src="/assets/icon/inception.svg" class="inline-icon"> inception

<table>
    <thead>
        <colgroup>
            <col style="width: 30%" />
            <col style="width: 20%" />
            <col style="width: 50%" />
        </colgroup>
        <tr>
            <th>Model name</th>
            <th>Pricing</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
<tr>
    <td>
        <code>
            @inception/mercury
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.25 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 1.00 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Extremely fast model by generative diffusion.
        <div class="model-capabilities">
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
    </tbody>
</table>

## <img src="/assets/icon/metaai.svg" class="inline-icon"> metaai

<table>
    <thead>
        <colgroup>
            <col style="width: 30%" />
            <col style="width: 20%" />
            <col style="width: 50%" />
        </colgroup>
        <tr>
            <th>Model name</th>
            <th>Pricing</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
<tr>
    <td>
        <code>
            @metaai/llama-3.3-70b
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.59 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 0.79 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Previous generation model with many parameters and surprisingly fast speed.
        <div class="model-capabilities">
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @metaai/llama-4-maverick-17b-128e
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.20 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 0.60 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Fast model, with 17 billion activated parameters and 128 experts.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @metaai/llama-4-scout-17b-16e
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.11 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 0.34 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Smaller version of the Llama 4 family with 17 billion activated parameters and 16 experts.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @metaai/llama-3.1-8b
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.05 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 0.08 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Cheap and fast model for less demanding tasks.
        <div class="model-capabilities">
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
    </tbody>
</table>

## <img src="/assets/icon/mistral.svg" class="inline-icon"> mistral

<table>
    <thead>
        <colgroup>
            <col style="width: 30%" />
            <col style="width: 20%" />
            <col style="width: 50%" />
        </colgroup>
        <tr>
            <th>Model name</th>
            <th>Pricing</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
<tr>
    <td>
        <code>
            @mistral/pixtral-large
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 2.00 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 6.00 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Pixtral Large is the second model in our multimodal family and demonstrates frontier-level image understanding. Particularly, the model is able to understand documents, charts and natural images, while maintaining the leading text-only understanding of Mistral Large 2.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images
</div>
<div>
    <i class="ri-instance-line"></i>
    Function calls
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</tr>
<tr>
    <td>
        <code>
            @mistral/magistral-medium
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 2.00 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 5.00 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Mistral's frontier-class reasoning model update released September 2025 with vision support.
        <div class="model-capabilities">
<div>
    <i class="ri-image-circle-line"></i>
    Input: accepts images
</div>
<div>
    <i class="ri-lightbulb-line"></i>
    Reasoning
</div>
<div>
    <i class="ri-braces-line"></i>
    JSON functions
</div>
        </div>
    </td>
</
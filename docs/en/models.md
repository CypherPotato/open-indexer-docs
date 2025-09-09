# Models

AIVAX provides models from different providers to make development even faster, eliminating the need to configure an account for each provider to access their latest models.

See the list below of available models and their pricing. All prices consider the total input and output tokens, with or without cache.

All prices are in United States dollars.

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
        Command A is a highly efficient generative model that excels at agentic and multilingual use cases.
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
            @cohere/command-r
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
                Output:
            </small>
            <div>
                $ 1.50 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Command R is a scalable generative model targeting RAG and Tool Use to enable production-scale AI for enterprise.
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
            @cohere/command-r-plus
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
                Output:
            </small>
            <div>
                $ 1.50 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Command R+ is a state-of-the-art RAG-optimized model designed to tackle enterprise‑grade workloads.
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
            @deepseekai/r1-0528
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 1.35 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 5.40 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        The DeepSeek R1 0528 model has improved reasoning capabilities, this version also offers a reduced hallucination rate, enhanced support for function calling, and better experience for vibe coding.
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
            @deepseekai/v3-0324
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 1.14 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 4.56 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        DeepSeek‑V3‑0324 demonstrates notable improvements over its predecessor, DeepSeek‑V3, in several key aspects, including enhanced reasoning, improved function calling, and superior code generation capabilities.
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
            @deepseekai/r1-distill-llama-70b
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 0.75 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 0.99 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Distilled Llama 3 70B model emulating R1’s chain‑of‑thought prowess. Offers transparent reasoning blocks and fast throughput on Groq hardware.
        <div class="model-capabilities">
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
        Google's best model in terms of price‑performance, offering well‑rounded capabilities. 2.5 Flash is best for large‑scale processing, low‑latency, high‑volume tasks that require thinking, and agentic use cases.
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
        Gemini 2.0 Flash delivers next‑gen features and improved capabilities, including superior speed, native tool use, and a 1M token context window.
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
        General‑purpose model, with image recognition, smart and fast. Great for an economical chat.
        <div class="model-capabilities">
<div
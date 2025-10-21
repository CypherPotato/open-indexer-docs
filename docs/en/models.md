# Models

AIVAX provides models from different providers to make development even faster, eliminating the need to set up an account for each provider to access their latest models.

See the list below of available models and their pricing. All prices consider the total input and output tokens, with or without caching.

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
            @anthropic/claude-4.1-opus
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 15.00 <small>/1m tokens</small>
            </div>
        </div>
        <div class="item-pricing">
    <small>
        Input (cached):
    </small>
    <div>
        $ 1.50 <small>/1m tokens</small>
    </div>
</div>
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 75.00 <small>/1m tokens</small>
            </div>
        </div>
    </td>
    <td>
        Claude Opus 4.1 is Anthropic’s flagship model, offering improved performance in coding, reasoning, and agentic tasks.
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
        Anthropic's mid-size model with superior intelligence for high-volume uses in coding, in-depth research, agents, &amp; more.
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
            @anthropic/claude-4.5-sonnet:discounted
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 1.80 <small>/1m tokens</small>
            </div>
        </div>
        
        <div class="item-pricing">
            <small>
                Output:
            </small>
            <div>
                $ 9.00 <small>/1m tokens</small>
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
            @anthropic/claude-4.5-haiku
        </code>
    </td>
    <td>
        <div class="item-pricing">
            <small>
                Input:
            </small>
            <div>
                $ 1.00 <small>/1m tokens</small>
            </div>
        </div>
        <div class="item-pricing">
    <small>
        Input (cached):
    </small>
    <div>
        $ 0.10 <small>/1m tokens</small>
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
        Claude Haiku 4.5 is Anthropic’s fastest and most efficient model, offering near‑frontier intelligence with much lower cost and latency than larger Claude models.
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
</tr
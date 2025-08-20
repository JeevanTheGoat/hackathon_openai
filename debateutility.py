import torch 
from transformers import AutoModelForCausalLM, AutoTokenizer
import random

def load_gpt_oss_model(model_name="openai-community/gpt-oss-20b"):
    """
    Load the GPT-OSS model and tokenizer.
    """
    print("Loading GPT-OSS model...")
    tokenizer = AutoTokenizer.from_pretrained(model_name)  # fixed typo: "pretained" → "pretrained"
    model = AutoModelForCausalLM.from_pretrained(          # fixed typo: "CasualLM" → "CausalLM"
        model_name,
        torch_dtype=torch.float16,
        device_map="auto"  # automatically assigns layers to GPU/CPU
    )
    return model, tokenizer


# ------------------- Debater Class -------------------
class Debater:
    """
    A single AI debater with a name, stance, and style.
    """
    def __init__(self, name, stance, style, model, tokenizer):
        self.name = name
        self.stance = stance
        self.style = style
        self.model = model
        self.tokenizer = tokenizer 

    def generate_argument(self, prompt):
        """
        Generate a single argument from the AI using GPT-OSS.
        """
        input_text = f"{self.name} ({self.style}, stance: {self.stance}) says about {prompt}: "
        inputs = self.tokenizer(input_text, return_tensors="pt").to(self.model.device)
        
        # actual generation 
        output_ids = self.model.generate(
            **inputs, 
            max_length=120,
            temperature=0.8,
            do_sample=True,
            top_p=0.9,
        )
        output_text = self.tokenizer.decode(output_ids[0], skip_special_tokens=True)
        
        # strip away the input prompt from the model's output
        return output_text.replace(input_text, "").strip()


# ------------------- Debate Manager Class -------------------
class DebateManager:
    """
    Handles multiple debaters, rounds, and overall debate flow.
    """
    def __init__(self, topic, debaters):
        self.topic = topic
        self.debaters = debaters
        self.history = []  # stores full history
        
    def run_opening(self):
        """
        Each debater gives their opening statement.
        """
        round_statements = []
        for debater in self.debaters:
            argument = debater.generate_argument(self.topic)
            statement = f"{debater.name} (opening): {argument}"
            self.history.append(statement)
            round_statements.append(statement)
        return round_statements

    def run_rebuttals(self):
        """
        Each debater rebuts the previous debater.
        """
        round_statements = []
        for i, debater in enumerate(self.debaters):
            prev_statement = self.history[-1] if self.history else "No prior statement."
            argument = debater.generate_argument(f"Respond to this: {prev_statement}")
            statement = f"🔸 {debater.name} (rebuttal): {argument}"
            self.history.append(statement)
            round_statements.append(statement)
        return round_statements

    def run_closing(self):
        """
        Each debater gives a closing statement.
        """
        round_statements = []
        for debater in self.debaters:
            argument = debater.generate_argument(f"Closing on {self.topic}")
            statement = f"✅ {debater.name} (closing): {argument}"
            self.history.append(statement)
            round_statements.append(statement)
        return round_statements


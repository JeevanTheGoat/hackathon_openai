import streamlit as st 
from debate_utils import load_gpt_oss_model, Debater, DebateManager 
import random


st.set_page_config(
    page_title = "Debate Club"
    page_icon = "🎤"
    layout = "centered"
)
with st.sidebar:
    st.title("🎤 AI Debate Club")
    st.markdown("Choose a feature below")
    
    choice = st.radio(
        "Menu", ["Run a debate", "About", "Vote"]
    )

def get_model():
    return load_gpt_oss_model()

model, tokenizer = get_model()

if choice == "Run a debate":
    st.header("Watch AI debate each other")
    topic = st.text_input("Enter a debate topic: Should pinneaple be allowed on pizza")
    num_debaters = st.slider("Number of debaters:", 2, 5, 3)
    
    if st.button("start debate"):
        styles = ["funny", "serious", "aggresive", "philosophical", "creative"]
        stances = ["strongly for", "strongly against", "neutral", "mixed"]
        
    debaters = []
    for i in range(num_debaters):
        debater = Debater(
            name = f"AI Debater_{i+1}",
            stance = random.choice(stances),
            style = random.choice(styles),
            model = model, 
            tokenizer = tokenizer
        )
        debaters.append(debater)
    
    debate = DebateManager(topic, debaters )
    
    st.subheader("Opening Headings")
    for opening in debate.run_opening():
        st.write(opening)
        
    st.subheader("Rebuttals")
    for rebuttal in debate.run_rebuttals():
        st.write(rebuttal)

    st.subheader("Closing Statements")
    for closing in debate.run_closing():
            st.write(closing)

    st.success("🎉 Debate finished! Go to the Vote section to pick a winner.")
    
elif choice == "About":
    st.header("About Debate Club")
    st.write("""
        The AI Debate Club is a fun project built for a hackathon.  
        Multiple GPT-OSS powered debaters argue on any topic you choose.  
        Each debater has a random stance and personality (funny, serious, etc).  
        You can then watch the debate unfold in opening, rebuttal, and closing rounds.
    """)
    
elif choice == "Vote":
    st.header("🗳️ Vote for the Winner")
    st.write("After watching a debate, select the AI who you think won.")
    debater_vote = st.selectbox("Who won the debate?", ["AI_Debater_1", "AI_Debater_2", "AI_Debater_3", "AI_Debater_4", "AI_Debater_5"])
    if st.button("Submit Vote"):
        st.success(f"✅ Thanks! You voted for {debater_vote}")
    
    
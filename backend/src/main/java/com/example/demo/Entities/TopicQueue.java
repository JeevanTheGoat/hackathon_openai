package com.example.demo.entities;

import java.util.LinkedList;
import java.util.Queue;

public class TopicQueue {

    //not done yet

    private Queue<String> topics = new LinkedList<>();

    public boolean isEmpty(){
        return topics.isEmpty();
    }

    public String getTopic(){
        return topics.poll();
    }

    public void addTopic(String topic){
        topics.offer(topic);
    }

    public String peekTopic() {
        return topics.peek();
    }

}

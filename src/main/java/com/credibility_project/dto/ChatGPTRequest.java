package com.credibility_project.dto;

import java.util.ArrayList;
import java.util.List;

public class ChatGPTRequest {

    private String model;
    private List<Message> messages;
    private int n;
    private double temperature;

    public ChatGPTRequest(String model, String prompt) {
        this.model = model;

        this.messages = new ArrayList<>();
        this.messages.add(new Message("user", prompt));
    }

}

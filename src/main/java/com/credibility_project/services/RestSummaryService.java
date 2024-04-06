package com.credibility_project.services;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.json.JSONArray;
import org.json.JSONObject;

public class RestSummaryService {
    public static void main(String[] args){
        try {
            // created account and generated api key for OpenAI
            // see: https://platform.openai.com/api-keys
            String apiKey = "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";

            // send a test article
            // articles will be generated using topics
            String testArticle = "https://www.cnn.com/2016/04/28/us/john-mcenroe-fast-facts/index.html";
            System.out.println("test article: " + testArticle);

            // Use ChatGPT or Claude endpoint for summarization
            // See https://platform.openai.com/docs/guides/text-generation for documentation
           // String endpoint = "https://api.openai.com/v1/chat/completions";
            String endpoint = "https://api.openai.com/v1/chat/completions";
            //String model = "gpt-3.5-turbo";
            String model = "davinci-002";

            // Create a summarization request
            //URL url = new URL(endpoint);
            HttpURLConnection con = (HttpURLConnection) new URL(endpoint).openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Authorization", "Bearer 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");
            con.setRequestProperty("Content-Type", "application/json");
            int maxTokens = 4096;
            JSONArray messages = new JSONArray();
            JSONObject userMessage = new JSONObject();
            userMessage.put("role", "user");
            userMessage.put("prompt", "Summarize the article" + testArticle);

            con.setDoOutput(true);

            // check on the connection
            System.out.println(con);

            JSONObject requestBody = new JSONObject();
            requestBody.put("model", model);
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", maxTokens);


            // Create a request that includes a prompt for summarization
            //String requestBody = "{\"model\": \"" + model + "\", \"messages\": [{\"role\": \"user\", \"content\": \"" + "Where is St. Louis?" + "\"}]}";
                    //"{\"prompt\": \"Summarize the article: " + testArticle + "\"}";

            // Send the request to ChatGPT or Claude
            //con.getOutputStream().write(requestBody.getBytes());

            OutputStreamWriter writer = new OutputStreamWriter(con.getOutputStream());
            writer.write(requestBody.toString());
            writer.flush();

            // We have the response now - read it, write it to PostGresSql
            // initially read contents to test
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;

            while ((line = in.readLine()) != null) {
                response.append(line);
            }
            in.close();

            System.out.println(response.toString());

            String jsonResponse = response.toString();
            // parse json
            System.out.println("Initial json: " + jsonResponse);

            // Display summarized text
            // Next iteration - write summarization to PostGresSql
            System.out.println("Summarized test: " ); //summarizedText

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}

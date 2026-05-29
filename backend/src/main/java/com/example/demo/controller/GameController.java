package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class GameController {

    record RangeRequest(int low, int high) {}
    record FeedbackRequest(int low, int high, int guess, String feedback) {}

    @PostMapping("/api/game/start")
    public Map<String, Object> startGame(@RequestBody RangeRequest range) {
        if (range == null) {
            return error("Missing range data.");
        }

        int low = range.low();
        int high = range.high();
        if (low > high) {
            return error("Lower bound must be less than or equal to upper bound.");
        }

        int guess = makeGuess(low, high);
        return response(guess, low, high, "I will guess " + guess + ". Choose one of the responses below.");
    }

    @PostMapping("/api/game/respond")
    public Map<String, Object> respond(@RequestBody FeedbackRequest request) {
        if (request == null || request.feedback() == null) {
            return error("Missing response data.");
        }

        int low = request.low();
        int high = request.high();
        int guess = request.guess();
        String feedback = request.feedback().trim().toLowerCase();

        if (low > high) {
            return error("Impossible boundaries: lower bound is greater than upper bound.");
        }
        if (guess < low || guess > high) {
            return error("The current guess is outside the known boundaries.");
        }

        switch (feedback) {
            case "too low":
            case "low":
                low = guess + 1;
                break;
            case "too high":
            case "high":
                high = guess - 1;
                break;
            case "correct":
            case "right":
                return response(guess, low, high, "I guessed your number! Congratulations!", true);
            default:
                return error("Please answer with 'too low', 'too high', or 'correct'.");
        }

        if (low > high) {
            return error("Your answer makes the range impossible. Please check your previous response.");
        }

        int nextGuess = makeGuess(low, high);
        return response(nextGuess, low, high, "Is it " + nextGuess + "?");
    }

    private int makeGuess(int low, int high) {
        return low + (high - low) / 2;
    }

    private Map<String, Object> response(int guess, int low, int high, String message) {
        return response(guess, low, high, message, false);
    }

    private Map<String, Object> response(int guess, int low, int high, String message, boolean finished) {
        Map<String, Object> map = new HashMap<>();
        map.put("guess", guess);
        map.put("low", low);
        map.put("high", high);
        map.put("message", message);
        map.put("finished", finished);
        map.put("error", false);
        return map;
    }

    private Map<String, Object> error(String message) {
        return Map.of("error", true, "message", message);
    }
}

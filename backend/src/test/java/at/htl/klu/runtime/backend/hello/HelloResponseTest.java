package at.htl.klu.runtime.backend.hello;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class HelloResponseTest {

    @Test
    void storesMessage() {
        HelloResponse response = new HelloResponse("Hallo Welt");

        assertEquals("Hallo Welt", response.message());
    }
}

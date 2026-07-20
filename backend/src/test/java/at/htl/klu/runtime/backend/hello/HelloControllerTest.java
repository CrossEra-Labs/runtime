package at.htl.klu.runtime.backend.hello;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class HelloControllerTest {

    @Test
    void helloReturnsGreeting() {
        HelloResponse response = new HelloController().hello();

        assertEquals("Hallo Welt", response.message());
    }
}

package at.htl.klu.runtime.backend.hello;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class HelloControllerTest {

  @Test
  void helloReturnsGreeting() {
    HelloResponse response = new HelloController().hello();

    assertEquals("Hallo Welt", response.message());
  }
}

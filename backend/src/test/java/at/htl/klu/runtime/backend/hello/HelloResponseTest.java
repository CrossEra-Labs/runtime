package at.htl.klu.runtime.backend.hello;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class HelloResponseTest {

  @Test
  void storesMessage() {
    HelloResponse response = new HelloResponse("Hallo Welt");

    assertEquals("Hallo Welt", response.message());
  }
}

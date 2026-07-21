package at.htl.klu.runtime.backend.hello;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hello")
public class HelloController {

  @GetMapping
  public HelloResponse hello() {
    return new HelloResponse("Hallo Welt");
  }
}

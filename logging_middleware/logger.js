import axios from 'axios';

export async function Log(stack, level, pkg, message) {
    try {
    await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message
      }
    );
  } catch (err) {
    console.error("Logging failed");
  }
}
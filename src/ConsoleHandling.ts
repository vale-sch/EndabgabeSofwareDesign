import * as readline from "readline";

class ConsoleHandling {
  private static _instance: ConsoleHandling = new ConsoleHandling();

  // logger object with syslog levels as specified loglevels
  // logs into build_service.log in directory log and onto console of running node.js process
  private consoleLine: readline.ReadLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  constructor() {
    if (ConsoleHandling._instance)
      throw new Error("Use ConsoleHandling.getInstance() instead new ConsoleHandling()");
    ConsoleHandling._instance = this;
  }

  public static getInstance(): ConsoleHandling {
    return ConsoleHandling._instance;
  }

  public question(_question: string): Promise<string> {
    return new Promise((resolve) => {
      this.consoleLine.question(_question.toString(), (_answer: string) => {
        resolve(_answer);
      });
    });
  }

  public showPossibilities(_showPossibilities: string[], _question: string): Promise<string> {
    this.consoleLine.write("\n");
    this.consoleLine.write("what do you want to do? ".color_at_256(226));
    this.consoleLine.write("\n");
    for (let possibility of _showPossibilities) {
      this.consoleLine.write(possibility.toString());
      this.consoleLine.write("\n");
    }
    this.consoleLine.write("\n");

    return new Promise((resolve) => this.consoleLine.question(_question.toString(), (answer: string) => {
      resolve(answer);
    }));
  }

  public printInput(_input: string): void {
    this.consoleLine.write(_input);
    this.consoleLine.write("\n");
  }

  public closeConsole(): void {
    this.consoleLine.close();
  }
}

export default ConsoleHandling.getInstance();
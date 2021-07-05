import ConsoleHandling from "./ConsoleHandling";


export class Administrator {
    public static username: string = "admin";
    public static password: string = "password";

    public async showAdminMethods(): Promise<void> {
        ConsoleHandling.consoleLine.write("Hello Admin!" + " \n");
        let answer: String = await ConsoleHandling.showPossibilities(["1. Create new Vaccination Day", "2. Get the Day Overview", "3. Get the percantage of open and booked Vaccinations", "4. Get the free clock times", "5. Get complete Statistics", "6. Quit"], "Which function do you want to use? (1): ");
        this.handleAnswer(answer);
    }

    public async handleAnswer(answer: String): Promise<void> {
        switch (answer) {
            case "1":
                break;
            case "2":
                break;
            case "3":
                break;
            case "4":
                ConsoleHandling.printInput("search by box office greater than");
                break;
            case "5":
                break;
            case "6":
                ConsoleHandling.consoleLine.close();
            default:
                break;
        }
        await this.goNext();
    }
    public async goNext(): Promise<void> {
        let answer: String = await ConsoleHandling.question("Back to overview? ");
        switch (answer.toLowerCase()) {
            case "y":
            case "yes":
            default:
                this.showAdminMethods();
                break;
            case "n":
            case "no":
                ConsoleHandling.closeConsole();
                break;
        }
    }

}
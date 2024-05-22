import { PrismaClient } from "@prisma/client";
//Reference: Fullstækk LMS/kurs
const prisma = new PrismaClient();

const taskData = [
  { text: "Skriv resultatet av regneoperasjonen", type: "add", data: "9|4" },
  { text: "Skriv resultatet av regneoperasjonen", type: "add", data: "50|91" },
  { text: "Skriv resultatet av regneoperasjonen", type: "subtract", data: "10|9" },
  { text: "Skriv resultatet av regneoperasjonen", type: "subtract", data: "15|11" },
  { text: "Skriv resultatet av regneoperasjonen", type: "multiply", data: "8|80" },
  { text: "Skriv resultatet av regneoperasjonen", type: "multiply", data: "8|7" },
  { text: "Skriv resultatet av regneoperasjonen", type: "multiply", data: "8|8" },
  { text: "Skriv resultatet av regneoperasjonen", type: "divide", data: "50|5" },
  { text: "Skriv resultatet av regneoperasjonen", type: "divide", data: "40|2" },
  { text: "Skriv resultatet av regneoperasjonen", type: "divide", data: "90|2" },
  
];

async function createTasks() {
  try {
    await prisma.task.deleteMany();


    const taskPromises = taskData.map((task) =>
      prisma.task.create({
        data: task,
      })
    );

    await Promise.all(taskPromises);
    console.log("Tasks created successfully!");
  } catch (error) {
    console.error("Error creating tasks:", error);
  } finally {
    await prisma.$disconnect(); 
  }
}

createTasks();

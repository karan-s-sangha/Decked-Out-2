import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class NumOfBlocks {
    public static int counter;
    NumOfBlocks() {
        counter = 0;
    }

    public static void main(String[] args) {
        String directoryPath = "./map";
        for (int i = 0; i <= 44; i++) {
            String fileName = "layer_-" + i + ".txt";
            modifyFile(directoryPath, fileName);
        }

    }

    public static void modifyFile(String directoryPath, String fileName) {
        File file = new File(directoryPath, fileName);
        File tempFile = new File(directoryPath, "temp_" + fileName);

        try (BufferedReader reader = new BufferedReader(new FileReader(file));
             BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile))) {

            String line;
            while ((line = reader.readLine()) != null) {
                counter++;
            }
            System.out.println(counter);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Replace the original file with the modified one
        if (!file.delete()) {
            System.out.println("Could not delete file: " + file.getName());
            return;
        }

        if (!tempFile.renameTo(file)) {
            System.out.println("Could not rename file: " + tempFile.getName());
        }
    }
}

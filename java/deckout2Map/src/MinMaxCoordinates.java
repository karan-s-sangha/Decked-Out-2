//MinMaxCoordinates
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class MinMaxCoordinates {
    public static void main(String[] args) {
        String directoryPath = "./map";
        int min_x = Integer.MAX_VALUE, min_y = Integer.MAX_VALUE, min_z = Integer.MAX_VALUE;
        int max_x = Integer.MIN_VALUE, max_y = Integer.MIN_VALUE, max_z = Integer.MIN_VALUE;
        int minFileX = 0, minFileY = 0, minFileZ = 0;
        int maxFileX = 0, maxFileY = 0, maxFileZ = 0;

        for (int i = 0; i <= 44; i++) {
            String filePath = directoryPath + "/layer_-" + i + ".txt";
            try {
                File file = new File(filePath);
                BufferedReader reader = new BufferedReader(new FileReader(file));

                String line;
                while ((line = reader.readLine()) != null) {
                    // Extracting coordinates from the line
                    String[] parts = line.split("[(),]");
                    int x = Integer.parseInt(parts[1].trim());
                    int y = Integer.parseInt(parts[2].trim());
                    int z = Integer.parseInt(parts[3].trim());

                    // Update min and max values
                    if (x < min_x) {
                        min_x = x;
                        minFileX = i;
                    }
                    if (y < min_y) {
                        min_y = y;
                        minFileY = i;
                    }
                    if (z < min_z) {
                        min_z = z;
                        minFileZ = i;
                    }
                    if (x > max_x) {
                        max_x = x;
                        maxFileX = i;
                    }
                    if (y > max_y) {
                        max_y = y;
                        maxFileY = i;
                    }
                    if (z > max_z) {
                        max_z = z;
                        maxFileZ = i;
                    }
                }
                reader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        // Printing the results
        System.out.println("Smallest values:");
        System.out.println("X: " + min_x + " in file: " + minFileX);
        System.out.println("Y: " + min_y + " in file: " + minFileY);
        System.out.println("Z: " + min_z + " in file: " + minFileZ);

        System.out.println("\nGreatest values:");
        System.out.println("X: " + max_x + " in file: " + maxFileX);
        System.out.println("Y: " + max_y + " in file: " + maxFileY);
        System.out.println("Z: " + max_z + " in file: " + maxFileZ);
    }
}

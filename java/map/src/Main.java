import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import javax.imageio.ImageIO;

public class Main {

    public static void main(String[] args) {
        String inputImagePath = "map.png"; // Path to input PNG image
        String outputTextFilePath = "output.txt"; // Path to output text file

        try {
            BufferedImage image = ImageIO.read(new File(inputImagePath));
            FileWriter writer = new FileWriter(outputTextFilePath);

            int width = image.getWidth();
            int height = image.getHeight();

            for (int y = 0; y < height; y += 12) {
                for (int x = 0; x < width; x += 12) {
                    if (x < width && y < height) {
                        Color color = new Color(image.getRGB(x, y));
                        if (color.getRGB() == Color.decode("#741D32").getRGB()) {
                            writer.write("#");
                        } else {
                            writer.write("*");
                        }
                    }
                }
                writer.write("\n");
            }

            writer.close();
            System.out.println("ran");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

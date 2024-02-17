import java.io.File;
public class InsertASSETMANAGER {


        public static void main(String[] args) {
            String folderPath = "./blocks";
            File folder = new File(folderPath);

            if (!folder.exists() || !folder.isDirectory()) {
                System.out.println("Invalid folder path.");
                return;
            }

            File[] files = folder.listFiles();
            if (files == null || files.length == 0) {
                System.out.println("No files found in the folder.");
                return;
            }

            for (File file : files) {
                if (file.isFile()) {
                    String fileName = file.getName();
                    System.out.println("ASSET_MANAGER.queueDownload(\"./Art/resources/" + fileName + "\");");
                }
            }
        }


}

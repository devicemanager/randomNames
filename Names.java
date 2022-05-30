import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Random;
import java.util.List;
import java.util.Arrays;
public class Names
{
	public static void main(String[] args)
	{
		try
		{
			List<String> data = new ArrayList<>();//list to store data
			String file = "Surnames.txt";//default file path
                        if (args.length != 0) file = args[0]; //overwrite with argument
			FileReader fr = new FileReader(file);
			BufferedReader br = new BufferedReader(fr);
			
			//Reading until we run out of lines
			String line = br.readLine();
			while(line != null)
			{
				data.add(line);
				line = br.readLine();
			}
			br.close();
			int index = new Random().nextInt(data.size());	
			String name = data.get(index);
			System.out.println(name);
		}
		catch(Exception e)
		{
			System.out.print(e);
		}
	}
}

# Generate random names for testing purposes

I have created a small project from the data that grabs names from wiktionary, there are quite some resources like:

https://github.com/ErikGartner/randy.git
https://github.com/originpath/docker-openldap-rbac.git
https://github.com/roninkelt/rpgx_playing.git

I'm sure you are able to find the original wiktionary scraper better then me right now. 

The result can be parsed in java, bash, sql, etc.

The schema is very simple and can easily be extended:

The output from .schema
```
CREATE TABLE surnames (
surname TEXT not null);
CREATE TABLE males (
male TEXT not null);
CREATE TABLE females (
female TEXT not null);
```

The import of the different tables was also very simple:
```
.mode csv
.import Female_given_names.txt females 
.import Male_given_names.txt males
.import Surnames.txt surnames
```

A few examples:
```
sqlite names.db "select male from males order by random() limit 1;"
```
```
sqlite3 names.db "select female from females order by random() limit 1;"
```
```
sqlite3 names.db "select female,surname from (select female from females order by random() limit 1) join (select surname from surnames order by random() limit 1);"
```

A very small standalone java main class has been created to parse the file and output one random record to stdout:
```
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
```

Also the compilation is simple and has been done in a script together with an example of how you could use it:
```
javac Names.java
while true;do java Names Female_given_names.txt| tr '\n' ' ';java Names ; done
```
Since the command creates a linefeed on stdout, this is simply translated to a space. You could also translate it to a comma by replacing the last argument in the tr command.

I hope you find this project usefull an if you do I would like to get some feedback on how you use this and also if you have extended this, I would like to get a PR for a richer experience.

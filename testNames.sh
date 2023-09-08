javac Names.java
#while true;do java Names Female_given_names.txt| tr '\n' ',';java Names ; done
java Names Female_given_names.txt|tr '\n' '#'|sed -e "s/#/, /";java Names

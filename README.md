SOLUTIONS:

1. SELECT name FROM padawans WHERE age > 100;
2. SELECT \* FROM padawans WHERE age >= 40;
3. SELECT name FROM padawans WHERE lightsaber_color = 'Green' AND species = 'Human';
4. SELECT name FROM padawans WHERE species = 'Togruta' OR species = 'Zabrak';
5. SELECT name FROM padawans WHERE species IN ('Togruta', 'Nautolan', 'Kel Dor');
6. SELECT DISTINCT lightsaber_color FROM padawans;
7. SELECT name FROM padawans WHERE name LIKE 'Lu%';
8. SELECT name FROM padawans WHERE name LIKE '%Ti';
9. SELECT name FROM padawans WHERE name LIKE 'A_soka Tano';
10. SELECT name FROM padawans WHERE name LIKE `'_i_ Fisto';`
11. SELECT AVG(age) AS average_age FROM padawans;
12. SELECT MAX(age) AS oldest FROM padawans;
13. SELECT MIN(age) AS youngest FROM padawans;
14. SELECT SUM(age) AS total_age FROM padawans;
15. SELECT name FROM padawans WHERE species != 'Human';
16. SELECT name FROM padawans ORDER BY age DESC LIMIT 3;
17. SELECT name FROM padawans WHERE name LIKE '%Sky%';
18. SELECT species, COUNT(\*) AS total FROM padawans GROUP BY species;
19. SELECT name FROM padawans WHERE lightsaber_color = 'None';

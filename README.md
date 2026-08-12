SOLUTIONS:

1. SELECT name FROM novates WHERE age > 100;
2. SELECT * FROM novates WHERE age >= 40;
3. SELECT name FROM novates WHERE resonance_color = 'Cyan' AND species = 'Human';
4. SELECT name FROM novates WHERE species = 'Avren' OR species = 'Myrin';
5. SELECT name FROM novates WHERE species IN ('Avren', 'Tavri', 'Orren');
6. SELECT DISTINCT resonance_color FROM novates;
7. SELECT name FROM novates WHERE name LIKE 'Ne%';
8. SELECT name FROM novates WHERE name LIKE '%ren';
9. SELECT name FROM novates WHERE name LIKE 'Ne_a';
10. SELECT name FROM novates WHERE name LIKE '_ira';
11. SELECT AVG(age) AS average_age FROM novates;
12. SELECT MAX(age) AS oldest FROM novates;
13. SELECT MIN(age) AS youngest FROM novates;
14. SELECT SUM(age) AS total_age FROM novates;
15. SELECT name FROM novates WHERE species != 'Human';
16. SELECT name FROM novates ORDER BY age DESC LIMIT 3;
17. SELECT name FROM novates WHERE name LIKE '%ral%';
18. SELECT species, COUNT(*) AS total FROM novates GROUP BY species;
19. SELECT name FROM novates WHERE resonance_color = 'None';

# PostgreSQL Interview – Query-Based Notes

## 1. Second-Highest Salary

- Find the second-highest salary using a subquery:

```sql
SELECT MAX(salary)
FROM employees
WHERE salary < (
    SELECT MAX(salary)
    FROM employees
);
```

- Using `DENSE_RANK()`:

```sql
SELECT salary
FROM (
    SELECT salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) t
WHERE rnk = 2;
```

- `DENSE_RANK()` is useful when duplicate salaries exist.

## 2. Nth-Highest Salary

- Example: Find the 3rd highest salary:

```sql
SELECT salary
FROM (
    SELECT salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) t
WHERE rnk = 3;
```

- Change `rnk = 3` to `rnk = N` for the Nth-highest salary.

## 3. Employees Earning More Than Average Salary

```sql
SELECT *
FROM employees
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
);
```

- The subquery calculates the overall average salary.
- The outer query returns employees earning above that average.

## 4. Employees Earning More Than Their Department Average

```sql
SELECT e.*
FROM employees e
WHERE e.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e.department_id
);
```

- Using a window function:

```sql
SELECT *
FROM (
    SELECT e.*,
           AVG(salary) OVER (
               PARTITION BY department_id
           ) AS dept_avg
    FROM employees e
) t
WHERE salary > dept_avg;
```

- `PARTITION BY department_id` calculates the average separately for each department.

## 5. Find Duplicate Employee Names

```sql
SELECT name, COUNT(*)
FROM employees
GROUP BY name
HAVING COUNT(*) > 1;
```

- `GROUP BY` groups records with the same name.
- `HAVING` filters groups.
- `COUNT(*) > 1` identifies duplicates.

## 6. WHERE vs HAVING

### WHERE

- Filters individual rows.
- Applied before grouping.

```sql
SELECT *
FROM employees
WHERE salary > 50000;
```

### HAVING

- Filters groups.
- Used with `GROUP BY`.

```sql
SELECT department_id, COUNT(*)
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5;
```

## 7. Highest-Paid Employee in Each Department

```sql
SELECT *
FROM (
    SELECT e.*,
           RANK() OVER (
               PARTITION BY department_id
               ORDER BY salary DESC
           ) AS rnk
    FROM employees e
) t
WHERE rnk = 1;
```

- `PARTITION BY department_id` creates a separate ranking for each department.
- `RANK()` handles employees having the same highest salary.

## 8. Second-Highest Salary in Each Department

```sql
SELECT *
FROM (
    SELECT e.*,
           DENSE_RANK() OVER (
               PARTITION BY department_id
               ORDER BY salary DESC
           ) AS rnk
    FROM employees e
) t
WHERE rnk = 2;
```

- `DENSE_RANK()` is useful when duplicate salaries exist.

## 9. Departments Having More Than 5 Employees

```sql
SELECT department_id,
       COUNT(*) AS employee_count
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5;
```

## 10. Count Employees in Each Department

```sql
SELECT department_id,
       COUNT(*) AS employee_count
FROM employees
GROUP BY department_id;
```

### Include Department Name

```sql
SELECT d.name,
       COUNT(e.id) AS employee_count
FROM departments d
LEFT JOIN employees e
    ON d.id = e.department_id
GROUP BY d.id, d.name;
```

- `LEFT JOIN` ensures departments with zero employees are also included.
- `COUNT(e.id)` returns `0` when there are no matching employees.

## 11. Employees Along With Department Name

```sql
SELECT e.name,
       d.name AS department
FROM employees e
JOIN departments d
    ON e.department_id = d.id;
```

- `JOIN` returns only employees having a matching department.

## 12. Employees Without a Department

```sql
SELECT e.*
FROM employees e
LEFT JOIN departments d
    ON e.department_id = d.id
WHERE d.id IS NULL;
```

- `LEFT JOIN` keeps all employees.
- `d.id IS NULL` identifies employees without a matching department.

## 13. Self Join

- A self join means joining a table with itself.
- Useful for employee-manager relationships.

```sql
SELECT e.name AS employee,
       m.name AS manager
FROM employees e
LEFT JOIN employees m
    ON e.manager_id = m.id;
```

- `e` represents the employee.
- `m` represents the manager.

## 14. Employees Earning More Than Their Manager

```sql
SELECT e.name AS employee,
       e.salary AS employee_salary,
       m.name AS manager,
       m.salary AS manager_salary
FROM employees e
JOIN employees m
    ON e.manager_id = m.id
WHERE e.salary > m.salary;
```

- This is a common self-join interview question.

## 15. ROW_NUMBER()

```sql
SELECT name,
       salary,
       ROW_NUMBER() OVER (
           ORDER BY salary DESC
       ) AS row_num
FROM employees;
```

- Gives every row a unique sequential number.
- Duplicate salaries still get different row numbers.

## 16. RANK()

```sql
SELECT name,
       salary,
       RANK() OVER (
           ORDER BY salary DESC
       ) AS rnk
FROM employees;
```

- Same salary gets the same rank.
- Ranking numbers can be skipped.

Example:

```text
Salary    Rank
100000      1
90000       2
90000       2
80000       4
```

## 17. DENSE_RANK()

```sql
SELECT name,
       salary,
       DENSE_RANK() OVER (
           ORDER BY salary DESC
       ) AS rnk
FROM employees;
```

- Same salary gets the same rank.
- Ranking numbers are not skipped.

Example:

```text
Salary    Dense Rank
100000        1
90000         2
90000         2
80000         3
```

## 18. ROW_NUMBER vs RANK vs DENSE_RANK

- `ROW_NUMBER()`
  - Always gives a unique number.
  - Duplicate values get different numbers.

- `RANK()`
  - Duplicate values get the same rank.
  - Skips ranking numbers.

- `DENSE_RANK()`
  - Duplicate values get the same rank.
  - Does not skip ranking numbers.

## 19. Top 3 Employees in Each Department

```sql
SELECT *
FROM (
    SELECT e.*,
           DENSE_RANK() OVER (
               PARTITION BY department_id
               ORDER BY salary DESC
           ) AS rnk
    FROM employees e
) t
WHERE rnk <= 3;
```

- `PARTITION BY` creates a separate ranking for every department.
- `DENSE_RANK()` ranks employees based on salary.

## 20. Employees Who Joined in the Last 30 Days

```sql
SELECT *
FROM employees
WHERE joining_date >= CURRENT_DATE - INTERVAL '30 days';
```

- `CURRENT_DATE` gives the current date.
- `INTERVAL '30 days'` represents 30 days.

## 21. Employees Who Joined in a Specific Year

```sql
SELECT *
FROM employees
WHERE joining_date >= DATE '2025-01-01'
  AND joining_date < DATE '2026-01-01';
```

- This finds employees who joined during 2025.

## 22. Employees Who Joined This Year

```sql
SELECT *
FROM employees
WHERE joining_date >= DATE_TRUNC('year', CURRENT_DATE);
```

- `DATE_TRUNC('year', CURRENT_DATE)` gives the beginning of the current year.

## 23. NULL Values

### Find Employees Without a Manager

```sql
SELECT *
FROM employees
WHERE manager_id IS NULL;
```

### Find Employees Having a Manager

```sql
SELECT *
FROM employees
WHERE manager_id IS NOT NULL;
```

- Never use:

```sql
WHERE manager_id = NULL;
```

- Use `IS NULL` or `IS NOT NULL`.

## 24. COALESCE()

- `COALESCE()` returns the first non-null value.

```sql
SELECT name,
       COALESCE(salary, 0) AS salary
FROM employees;
```

- If `salary` is `NULL`, it returns `0`.

## 25. Find Employees With Duplicate Salaries

```sql
SELECT *
FROM employees
WHERE salary IN (
    SELECT salary
    FROM employees
    GROUP BY salary
    HAVING COUNT(*) > 1
);
```

- Inner query finds salaries appearing more than once.
- Outer query returns employees having those salaries.

## 26. Department With Highest Average Salary

```sql
SELECT department_id,
       AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
ORDER BY avg_salary DESC
LIMIT 1;
```

- Groups employees by department.
- Calculates average salary.
- Sorts from highest to lowest.
- `LIMIT 1` returns the top department.

## 27. LIMIT

- Returns a maximum number of rows.

```sql
SELECT *
FROM employees
LIMIT 5;
```

## 28. OFFSET

- Skips a specified number of rows.

```sql
SELECT *
FROM employees
LIMIT 5 OFFSET 10;
```

- Skips the first 10 rows.
- Returns the next 5 rows.

## 29. DISTINCT

- Removes duplicate values.

```sql
SELECT DISTINCT department_id
FROM employees;
```

## 30. CONCAT()

- Used to concatenate strings.

```sql
SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM employees;
```

## 31. PostgreSQL String Concatenation

- PostgreSQL also supports `||`.

```sql
SELECT first_name || ' ' || last_name AS full_name
FROM employees;
```

## 32. DELETE vs TRUNCATE vs DROP

### DELETE

```sql
DELETE FROM employees
WHERE department_id = 10;
```

- Removes selected rows.
- Can use `WHERE`.

### TRUNCATE

```sql
TRUNCATE TABLE employees;
```

- Removes all rows quickly.
- Does not remove the table structure.

### DROP

```sql
DROP TABLE employees;
```

- Removes the entire table including its structure.

## 33. Important Query Patterns

### GROUP BY + COUNT

```sql
SELECT department_id, COUNT(*)
FROM employees
GROUP BY department_id;
```

### GROUP BY + HAVING

```sql
SELECT department_id, COUNT(*)
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5;
```

### JOIN

```sql
SELECT e.name, d.name
FROM employees e
JOIN departments d
    ON e.department_id = d.id;
```

### LEFT JOIN + IS NULL

```sql
SELECT e.*
FROM employees e
LEFT JOIN departments d
    ON e.department_id = d.id
WHERE d.id IS NULL;
```

### Window Function

```sql
SELECT *,
       DENSE_RANK() OVER (
           PARTITION BY department_id
           ORDER BY salary DESC
       ) AS rnk
FROM employees;
```

### Subquery

```sql
SELECT *
FROM employees
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
);
```

## 34. Interview Practice Checklist

- [ ] Second-highest salary
- [ ] Nth-highest salary
- [ ] Duplicate records
- [ ] Highest salary in each department
- [ ] Second-highest salary in each department
- [ ] Employees earning more than average salary
- [ ] Employees earning more than department average
- [ ] Top 3 employees in each department
- [ ] Employees without a department
- [ ] Employees earning more than their manager
- [ ] Departments having more than 5 employees
- [ ] ROW_NUMBER vs RANK vs DENSE_RANK
- [ ] WHERE vs HAVING
- [ ] JOIN vs LEFT JOIN
- [ ] DELETE vs TRUNCATE vs DROP
- [ ] NULL and COALESCE()
- [ ] Date queries
- [ ] GROUP BY
- [ ] HAVING
- [ ] Subqueries
- [ ] Window functions

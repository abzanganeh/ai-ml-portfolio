# Complete EDA Implementation Guide & Solutions

## Your Missing Data Problem - Solved

Based on your Colab notebook analysis, here are the specific solutions for handling missing data in the LeetCode dataset:

### Missing Data Analysis Results:
- **solution_link**: 838 missing (45.92%)
- **companies**: 76 missing (4.16%) 
- **related_topics**: 254 missing (13.92%)
- **similar_questions**: 1080 missing (59.18%)

### Recommended Implementation:

```python
# Step 1: Strategic missing data handling
def handle_missing_data(df):
    """Apply strategic missing data handling based on analysis"""
    
    # Drop columns with excessive missing data (>50%)
    columns_to_drop = ['solution_link', 'similar_questions']
    df_cleaned = df.drop(columns_to_drop, axis=1)
    print(f"Dropped columns: {columns_to_drop}")
    
    # Handle companies column (4.16% missing - low impact)
    df_cleaned['companies'] = df_cleaned['companies'].fillna('Unknown')
    
    # Handle related_topics column (13.92% missing - moderate impact)
    df_cleaned['related_topics'] = df_cleaned['related_topics'].fillna('General')
    
    print(f"Original shape: {df.shape}")
    print(f"Cleaned shape: {df_cleaned.shape}")
    print(f"Missing data after cleaning: {df_cleaned.isnull().sum().sum()}")
    
    return df_cleaned

# Step 2: Data type conversions
def convert_string_to_numeric(value):
    """Convert string values like '4.1M' to numeric"""
    if pd.isna(value):
        return value
    
    value = str(value).strip()
    
    if value.endswith('M'):
        return float(value[:-1]) * 1_000_000
    elif value.endswith('K'):
        return float(value[:-1]) * 1_000
    else:
        try:
            return float(value)
        except ValueError:
            return np.nan

# Apply data type conversions
def fix_data_types(df):
    """Fix data type issues identified in the analysis"""
    df_fixed = df.copy()
    
    # Convert accepted and submissions columns
    df_fixed['accepted_numeric'] = df_fixed['accepted'].apply(convert_string_to_numeric)
    df_fixed['submissions_numeric'] = df_fixed['submissions'].apply(convert_string_to_numeric)
    
    # Verify conversions
    print("Data type conversions completed:")
    print(f"accepted_numeric dtype: {df_fixed['accepted_numeric'].dtype}")
    print(f"submissions_numeric dtype: {df_fixed['submissions_numeric'].dtype}")
    
    return df_fixed

# Complete solution for your notebook
df_cleaned = handle_missing_data(leetcode_df)
df_final = fix_data_types(df_cleaned)
```

## Completing Your Remaining Questions

### Question 6: Handle Missing Values (SOLVED)
```python
# Use the handle_missing_data function above
df_cleaned = handle_missing_data(leetcode_df)
```

### Question 7: Convert Data Types (SOLVED)
```python
# Use the fix_data_types function above
df_final = fix_data_types(df_cleaned)

# Verify the changes
print("Before conversion:")
print(df_final[['accepted', 'submissions']].dtypes)
print("\nAfter conversion:")
print(df_final[['accepted_numeric', 'submissions_numeric']].dtypes)
```

### Question 8: Check for Duplicates
```python
# Check for duplicate IDs
duplicate_ids = df_final['id'].duplicated().sum()
print(f"Duplicate IDs: {duplicate_ids}")

# Check for duplicate titles
duplicate_titles = df_final['title'].duplicated().sum()
print(f"Duplicate titles: {duplicate_titles}")

# Show any duplicates if they exist
if duplicate_titles > 0:
    print("\nDuplicate titles:")
    print(df_final[df_final['title'].duplicated(keep=False)]['title'])
```

### Question 9: Plot Outliers
```python
# Select only numeric columns and create box plots
numeric_cols = df_final.select_dtypes(include=[np.number]).columns
fig, axes = plt.subplots(2, 3, figsize=(15, 10))
axes = axes.ravel()

for i, col in enumerate(numeric_cols[:6]):  # Plot first 6 numeric columns
    df_final.boxplot(column=col, ax=axes[i])
    axes[i].set_title(f'{col}')
    axes[i].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.show()
```

### Question 10: Identify Outliers
```python
def detect_outliers_iqr(df, column):
    """Detect outliers using IQR method"""
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    outliers = df[(df[column] < lower_bound) | (df[column] > upper_bound)]
    return outliers, lower_bound, upper_bound

# Detect outliers in key numeric columns
numeric_columns = ['likes', 'dislikes', 'acceptance_rate', 'frequency']
outlier_summary = {}

for col in numeric_columns:
    outliers, lower, upper = detect_outliers_iqr(df_final, col)
    outlier_summary[col] = {
        'count': len(outliers),
        'percentage': (len(outliers) / len(df_final)) * 100,
        'bounds': (lower, upper)
    }
    
print("Outlier Summary:")
for col, info in outlier_summary.items():
    print(f"{col}: {info['count']} outliers ({info['percentage']:.2f}%)")
```

### Question 11: Handle Outliers
```python
def handle_outliers(df, method='cap'):
    """Handle outliers using specified method"""
    df_handled = df.copy()
    
    if method == 'cap':
        # Cap outliers at 95th percentile
        for col in numeric_columns:
            upper_cap = df[col].quantile(0.95)
            df_handled[col] = df_handled[col].clip(upper=upper_cap)
    elif method == 'remove':
        # Remove rows with outliers in any column
        for col in numeric_columns:
            outliers, _, _ = detect_outliers_iqr(df, col)
            df_handled = df_handled.drop(outliers.index)
    
    return df_handled

# Apply capping method (preserves all data)
df_no_outliers = handle_outliers(df_final, method='cap')
print(f"Shape after handling outliers: {df_no_outliers.shape}")
```

### Questions 12-19: Visualization Solutions
```python
# Question 12: Top 20 companies
companies_expanded = df_final['companies'].str.split(',').explode()
top_companies = companies_expanded.value_counts().head(20)
plt.figure(figsize=(12, 8))
top_companies.plot(kind='barh')
plt.title('Top 20 Companies by Number of Problems')
plt.xlabel('Number of Problems')
plt.tight_layout()
plt.show()

# Question 13: Difficulty distribution
plt.figure(figsize=(8, 6))
difficulty_counts = df_final['difficulty'].value_counts()
plt.bar(difficulty_counts.index, difficulty_counts.values)
plt.title('Distribution of Problem Difficulty')
plt.xlabel('Difficulty Level')
plt.ylabel('Number of Problems')
plt.show()

# Question 14: Acceptance rate distribution
plt.figure(figsize=(8, 6))
plt.hist(df_final['acceptance_rate'], bins=30, alpha=0.7)
plt.title('Distribution of Acceptance Rate')
plt.xlabel('Acceptance Rate (%)')
plt.ylabel('Frequency')
plt.show()

# Question 15: Frequency distribution
plt.figure(figsize=(8, 6))
plt.hist(df_final['frequency'], bins=30, alpha=0.7)
plt.title('Distribution of Problem Frequency')
plt.xlabel('Frequency')
plt.ylabel('Count')
plt.show()

# Question 16: Likes vs dislikes scatter plot
plt.figure(figsize=(8, 6))
plt.scatter(df_final['likes'], df_final['dislikes'], alpha=0.6)
plt.xlabel('Likes')
plt.ylabel('Dislikes')
plt.title('Likes vs Dislikes Scatter Plot')
plt.show()

# Question 17: Accepted vs submissions scatter plot
plt.figure(figsize=(8, 6))
plt.scatter(df_final['accepted_numeric'], df_final['submissions_numeric'], alpha=0.6)
plt.xlabel('Accepted')
plt.ylabel('Submissions')
plt.title('Accepted vs Submissions Scatter Plot')
plt.show()

# Question 18: Average acceptance rate by difficulty
avg_acceptance = df_final.groupby('difficulty')['acceptance_rate'].mean().sort_values(ascending=False)
plt.figure(figsize=(8, 6))
avg_acceptance.plot(kind='bar')
plt.title('Average Acceptance Rate by Difficulty')
plt.xlabel('Difficulty')
plt.ylabel('Average Acceptance Rate (%)')
plt.xticks(rotation=45)
plt.show()

# Question 19: Acceptance rate vs frequency scatter plot
plt.figure(figsize=(8, 6))
plt.scatter(df_final['acceptance_rate'], df_final['frequency'], alpha=0.6)
plt.xlabel('Acceptance Rate (%)')
plt.ylabel('Frequency')
plt.title('Acceptance Rate vs Frequency')
plt.show()
```

## Adding the Tutorial to Your Website

### Step 1: Add Configuration
Add the tutorial configuration to your `data/tutorials.py`:

```python
{
    'title': 'Complete Exploratory Data Analysis: LeetCode Dataset',
    'slug': 'complete-eda-leetcode',
    'description': 'Master the complete EDA workflow from data loading to insights, using a real LeetCode dataset with 1825 coding problems.',
    'category': 'Data Science',
    'difficulty': 'intermediate',
    'duration': '90 minutes',
    'has_dedicated_template': True,
    'template_path': 'tutorials/complete-eda-leetcode/index.html',
    'published': True,
    'excerpt': 'Learn the complete EDA process: missing data strategies, outlier detection, visualization techniques, and statistical insights.',
    'tags': 'eda,pandas,matplotlib,seaborn,data-cleaning,statistics,visualization'
}
```

### Step 2: Create Files
1. Create `templates/tutorials/complete-eda-leetcode/index.html` (use the HTML artifact)
2. Create `static/css/tutorials/complete-eda-leetcode/eda-tutorial.css` (use the CSS artifact)

### Step 3: Restart Your Flask Application
The tutorial will automatically appear in your tutorials section after restart.

## Key Learning Outcomes

By creating this tutorial, you've learned:

1. **Strategic Missing Data Handling**: When to drop vs impute based on missing percentages and column importance
2. **Data Type Issues**: How to identify and fix problematic data types for analysis
3. **Complete EDA Workflow**: From initial exploration to actionable insights
4. **Practical Implementation**: Real solutions to your specific dataset challenges
5. **Portfolio Building**: Created a comprehensive tutorial for your website

This tutorial provides both a solution to your current assignment and valuable content for your portfolio that demonstrates your data science skills to potential employers or collaborators.

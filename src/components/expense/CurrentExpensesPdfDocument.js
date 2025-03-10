import React, { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { format, isSameMonth } from "date-fns";
import PropTypes from "prop-types";
import { styleTable } from "./ExpensesPdfDocumentStyles";
import S from "string";
import { sprintf } from "sprintf-js";
import { getLastExpenseDate } from "../../services/Helper";
import { sortExpensesBy } from "../../services/ExpensesService";

// Create styles
const styles = StyleSheet.create(styleTable);

// Create a component for the PDF content
const CurrentExpensesPdfDocument = ({ categories, expenses }) => {
  const [categoriesToPrint, setCategoriesToPrint] = useState([]);
  const [expensesToPrint, setExpensesToPrint] = useState([]);
  const [expenseDateRef, setExpenseDateRef] = useState(new Date());

  useEffect(() => {
    let lastExpenseDate = getLastExpenseDate(expenses);
    let expensesList = sortExpensesBy(
      expenses.filter((expense) => isSameMonth(expense.date, lastExpenseDate)),
      "date-category"
    );
    let categoriesList = categories
      .slice()
      .map((category) => ({
        ...category,
        totalExpenses: expensesList.filter((expense) => expense.category == category.name).reduce((acc, current) => (acc += current.amount), 0),
      }))
      .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));

    setExpenseDateRef(lastExpenseDate);
    setExpensesToPrint(expensesList);
    setCategoriesToPrint(categoriesList);
  }, [expenses]);

  if (!categoriesToPrint || !expensesToPrint) return;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Expense Report {format(expenseDateRef, "MMM yyyy")}</Text>
        <View
          style={{
            display: "table",
            width: "auto",
            borderStyle: "solid",
            borderColor: "#b6b6b6",
            borderWidth: 1,
            marginBottom: 20,
            padding: 5,
          }}
        >
          {categoriesToPrint?.map((category) => (
            <Text
              key={category.id}
              style={{
                fontSize: 10,
                color: category.budget && category.totalExpenses > category.budget ? "red" : "#555555",
                marginLeft: 12,
              }}
            >
              - {S(category.name).capitalize().s} : {sprintf("%.2f", category.totalExpenses)} {category.budget ? `/ ${sprintf("%.2f", category.budget)}` : ""} €
            </Text>
          ))}
          <Text
            style={{
              fontSize: 10,
              marginLeft: 12,
              marginTop: 10,
            }}
          >
            - Total :{" "}
            {sprintf(
              "%.2f €",
              categoriesToPrint.reduce((acc, curr) => acc + curr.totalExpenses, 0)
            )}
          </Text>
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Date</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Category</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Amount</Text>
            </View>
          </View>
          {/* Table Rows */}
          {expensesToPrint?.map((expense) => (
            <View key={expense.id} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{format(expense.date, "dd-MM-yyyy")}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{S(expense.category).capitalize().s}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{S(expense.description).capitalize().s}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={{ ...styles.tableCell, textAlign: "right" }}>{sprintf("%02.2f", expense.amount)} €</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

CurrentExpensesPdfDocument.propTypes = {
  expenses: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
};

export default CurrentExpensesPdfDocument;

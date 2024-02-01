import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { styleTable } from "./ExpensesPdfDocumentStyles";
import S from "string";
import { sprintf } from "sprintf-js";

// Create styles
const styles = StyleSheet.create(styleTable);

// Create a component for the PDF content
const ExpensesPdfDocument = ({ categories, expenses }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Expense Report {format(new Date(), "MMM yyyy")}</Text>
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
        {categories
          .slice()
          .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
          .map((category) => (
            <Text
              key={category.id}
              style={{
                fontSize: 10,
                color: category.budget && category.totalExpenses > category.budget ? "red" : "#555555",
                marginLeft: 12,
              }}
            >
              - {S(category.name).capitalize().s} : {sprintf("%.2f", category.totalExpenses)}{" "}
              {category.budget ? `/ ${sprintf("%.2f", category.budget)}` : ""} €
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
            categories.reduce((acc, curr) => acc + curr.totalExpenses, 0)
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
        {expenses.map((expense) => (
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

ExpensesPdfDocument.propTypes = {
  expenses: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
};

export default ExpensesPdfDocument;

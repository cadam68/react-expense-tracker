import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { styleTable } from "./ExpensesPdfDocumentStyles";

// Create styles
const styles = StyleSheet.create(styleTable);

// Create a component for the PDF content
const ExpensesPdfDocument = ({ expenses }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Expense Report</Text>
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
              <Text style={styles.tableCell}>{expense.category}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{expense.description}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{expense.amount}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

ExpensesPdfDocument.propTypes = {
  expenses: PropTypes.array.isRequired,
};

export default ExpensesPdfDocument;

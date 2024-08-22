import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import PropTypes from "prop-types";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create a component for the PDF content
const ExpensesPdf = ({ expenses }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        {expenses.map((expense) => (
          <Text key={expense.id}>{`${expense.date} - ${expense.category} - ${expense.description} - ${expense.amount}`}</Text>
        ))}
      </View>
    </Page>
  </Document>
);

ExpensesPdf.propTypes = {
  expenses: PropTypes.array.isRequired,
};

export default ExpensesPdf;

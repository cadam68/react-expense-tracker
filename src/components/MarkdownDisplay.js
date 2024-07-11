import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // To render HTML tags within Markdown content using react-markdown, you need to enable HTML rendering by using the rehype-raw plugin
import "./MarkdownStyles.css";
import { settings } from "../Settings";

const MarkdownDisplay = ({ filePath }) => {
  const [content, setContent] = useState("");

  const fetchMarkdownFile = async (filePath) => {
    let fileUrl = `${settings.baseApiUrl}/firebase/download?url=${encodeURIComponent(filePath)}`;

    const response = await fetch(fileUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
        "X-API-Key": settings.apiKey,
      },
    });

    if (!response.ok) throw new Error(`Could not retrieve the file`);
    const text = await response.text();
    return text;
  };

  useEffect(() => {
    const loadContent = async () => {
      const markdownContent = await fetchMarkdownFile(filePath);
      setContent(markdownContent);
    };

    loadContent();
  }, [filePath]);

  return (
    <div className="markdown-content">
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownDisplay;

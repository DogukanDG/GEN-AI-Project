import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Navbar from "../components/Navbar";

type Appointment = {
  id: number;
  date: string;
  time: string;
};

type Message = { role: "user"; content: string } | { role: "assistant"; content: string } | { role: "assistant-table"; content: string; data: Appointment[] };

function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAppointment = (item: Appointment) => {
    const newMessage: Message = {
      role: "user",
      content: `Randevu almak istiyorum: ${item.date} - ${item.time}`,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSubmit = () => {
    if (!prompt.trim()) return;

    const userMessage: Message = { role: "user", content: prompt };
    setPrompt("");
    setLoading(true);

    // Önce sadece kullanıcı mesajını göster
    setMessages([userMessage]);

    setTimeout(() => {
      const tableMessage: Message = {
        role: "assistant-table",
        content: "Uygun randevu tarihleri aşağıda listelenmiştir:",
        data: [
          { id: 1, date: "2025-06-10", time: "10:00" },
          { id: 2, date: "2025-06-11", time: "14:00" },
          { id: 3, date: "2025-06-12", time: "09:30" },
        ],
      };

      // Önceki her şey silindiği için sadece yeni mesajları göster
      setMessages([userMessage, tableMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <Navbar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          px: 2,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            py: 2,
            mb: 2,
          }}
        >
          {messages.map((msg, index) => {
            if (msg.role === "assistant-table") {
              return (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    alignSelf: "flex-start",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <Typography sx={{ color: "#000", mb: 1 }}>{msg.content}</Typography>

                  <TableContainer sx={{ backgroundColor: "#fff" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: "#000", fontWeight: "bold" }}>Tarih</TableCell>
                          <TableCell sx={{ color: "#000", fontWeight: "bold" }}>Saat</TableCell>
                          <TableCell sx={{ color: "#000", fontWeight: "bold" }}>İşlem</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {msg.data.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell sx={{ color: "#000" }}>{item.date}</TableCell>
                            <TableCell sx={{ color: "#000" }}>{item.time}</TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleAppointment(item)}
                              >
                                Randevu Al
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              );
            } else {
              return (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 1,
                    maxWidth: "75%",
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    backgroundColor: msg.role === "user" ? "#1976d2" : "#ffffff",
                    color: msg.role === "user" ? "#fff" : "#000",
                  }}
                >
                  <Typography>{msg.content}</Typography>
                </Paper>
              );
            }
          })}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "flex-end",
            pb: 2,
          }}
        >
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={6}
            placeholder="Mesajınızı yazın..."
            variant="outlined"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ height: "42px" }}
          >
            Gönder
          </Button>
        </Box>
      </Box>
    </Navbar>
  );
}

export default HomePage;

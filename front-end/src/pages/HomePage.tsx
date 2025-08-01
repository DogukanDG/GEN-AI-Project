import { useState, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  Stack,
  MenuItem,
} from "@mui/material";
import {
  Room as RoomIcon,
  People as PeopleIcon,
  Computer as ProjectorIcon,
  Air as AirIcon,
  Mic as MicIcon,
  Camera as CameraIcon,
  VolumeOff as QuietIcon,
  WbSunny as LightIcon,
} from "@mui/icons-material";
import NavBar from "../components/NavBar";
import { roomService } from "../services/roomService";
import type { RoomMatch, RoomSearchResponse } from "../services/roomService";
import { authService } from "../services/authService";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

type Message = { role: "user"; content: string } | { role: "assistant"; content: string } | { role: "assistant-rooms"; content: string; data: RoomSearchResponse };

function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomMatch | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [bookingDetails, setBookingDetails] = useState({
    userName: "",
    userEmail: "",
    startDatetime: "",
    endDatetime: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });
  const examplePrompts = [
    "Find a quiet meeting room for 4 people with air conditioning",
    "I need a quiet, air‑conditioned study room for 10 students tomorrow from 16:00 to 18:00.",
    "I need a study room with air‑conditioning for 8 students tomorrow from 10:00 to 12:00.",
  ];
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [reservedSlots, setReservedSlots] = useState<string[]>([]);
  const [dateChangeTimeout, setDateChangeTimeout] = useState<number | null>(null);
  const timeSlotPeriods = [
    { label: "08:00 - 10:00", start: "08:00", end: "10:00" },
    { label: "10:00 - 12:00", start: "10:00", end: "12:00" },
    { label: "12:00 - 14:00", start: "12:00", end: "14:00" },
    { label: "14:00 - 16:00", start: "14:00", end: "16:00" },
    { label: "16:00 - 18:00", start: "16:00", end: "18:00" },
    { label: "18:00 - 20:00", start: "18:00", end: "20:00" },
  ];

  // Helper function to check if time slots overlap
  const timeSlotOverlaps = (slotStart: string, slotEnd: string, reservedSlot: string): boolean => {
    try {
      // Parse the reserved slot (format: "HH:MM-HH:MM")
      const [reservedStart, reservedEnd] = reservedSlot.split("-");
      
      if (!reservedStart || !reservedEnd) {
        console.error("Invalid reserved slot format:", reservedSlot);
        return false;
      }

      // Convert times to minutes for easier comparison
      const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      };

      const slotStartMin = timeToMinutes(slotStart);
      const slotEndMin = timeToMinutes(slotEnd);
      const reservedStartMin = timeToMinutes(reservedStart);
      const reservedEndMin = timeToMinutes(reservedEnd);

      // Check for overlap: slot starts before reserved ends AND slot ends after reserved starts
      const hasOverlap = slotStartMin < reservedEndMin && slotEndMin > reservedStartMin;
      
      // Also check for exact match
      const isExactMatch = slotStartMin === reservedStartMin && slotEndMin === reservedEndMin;
      
      return hasOverlap || isExactMatch;
    } catch (error) {
      console.error("Error parsing time slot:", error, "Slot:", `${slotStart}-${slotEnd}`, "Reserved:", reservedSlot);
      return false;
    }
  };

  useEffect(() => {
    const user = authService.getStoredUser();
    if (user) {
      setBookingDetails((prev) => ({
        ...prev,
        userName: `${user.name} ${user.surname}`,
        userEmail: user.email,
      }));
    }
  }, []);

  const handleRoomBooking = async (room: RoomMatch, requirements: any) => {
    setSelectedRoom(room);

    setBookingDetails((prev) => ({
      ...prev,
      startDatetime: requirements.date || "",
      startTime: requirements.startTime || "",
      endTime: requirements.endTime || "",
      purpose: requirements.purpose || "",
    }));

    // Load reserved slots if date is available
    if (requirements.date && room.roomNumber) {
      try {
        console.log(`\n🔍 FETCHING RESERVED SLOTS FOR:`);
        console.log(`Room: ${room.roomNumber}`);
        console.log(`Date: ${requirements.date}`);
        
        const reserved = await roomService.getReservedSlots({
          roomNumber: room.roomNumber,
          date: requirements.date,
        });
        
        console.log(`\n📋 RAW RESERVED SLOTS FROM API:`, reserved);
        console.log(`Number of raw slots: ${reserved.length}`);
        
        // Rezerve edilmiş slotların formatını ve doğruluğunu kontrol edin
        const validReservedSlots = reserved.filter(slot => {
          // HH:MM-HH:MM formatına uygun mu kontrol et
          const isValidFormat = /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(slot);
          if (!isValidFormat) {
            console.error("❌ Invalid slot format received from API:", slot);
            return false;
          }
          console.log(`✅ Valid slot format: ${slot}`);
          return true;
        });
        
        console.log(`\n📝 VALID RESERVED SLOTS AFTER FILTERING:`, validReservedSlots);
        
        setReservedSlots(validReservedSlots);
      } catch (error: any) {
        console.error("Error loading reserved slots:", error);
        // Don't show error for rate limiting, just keep existing slots
        if (error.response?.status !== 429) {
          setReservedSlots([]);
        }
      }
    } else {
      setReservedSlots([]);
    }

    setBookingDialogOpen(true);
  };

  const handleBookingSubmit = async () => {
    if (!selectedRoom) return;

    try {
      setLoading(true);

      // Combine date and time for API
      const startDateTime = `${bookingDetails.startDatetime}T${bookingDetails.startTime}:00`;
      const endDateTime = `${bookingDetails.startDatetime}T${bookingDetails.endTime}:00`;

      await roomService.createReservation({
        roomNumber: selectedRoom.roomNumber,
        userName: bookingDetails.userName,
        userEmail: bookingDetails.userEmail,
        startDatetime: startDateTime,
        endDatetime: endDateTime,
        purpose: bookingDetails.purpose,
      });

      // Format the date for display
      const formattedDate = new Date(bookingDetails.startDatetime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Create custom success message with room and time details
      setSnackbar({
        open: true,
        message: `Room ${selectedRoom.roomNumber} successfully reserved for ${formattedDate} from ${bookingDetails.startTime} to ${bookingDetails.endTime}.`,
        severity: "success",
      });

      setBookingDialogOpen(false);
      setSelectedRoom(null);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "An error occurred while creating the reservation",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const userMessage: Message = { role: "user", content: prompt };
    setPrompt("");
    setShowWelcome(false);
    setLoading(true);

    // Show user message immediately
    setMessages((prev) => [...prev, userMessage]);

    try {
      const searchResult = await roomService.searchRoomsWithAI({ prompt });

      const assistantMessage: Message = {
        role: "assistant-rooms",
        content: searchResult.message,
        data: searchResult,
      };
      if (searchResult.requirements?.date) {
        setBookingDetails((prev) => ({
          ...prev,
          startDatetime: searchResult.requirements.date || "",
          startTime: searchResult.requirements.startTime || "",
          endTime: searchResult.requirements.endTime || "",
        }));
      } else {
        setBookingDetails((prev) => ({
          ...prev,
          startDatetime: "",
        }));
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: "assistant",
        content: error.response?.data?.message || "An error occurred during the search. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced date change handler to prevent too many API calls
  const handleDateChange = useCallback(
    async (date: Date | null) => {
      setBookingDetails((prev) => ({
        ...prev,
        startDatetime: date ? date.toISOString().split("T")[0] : "",
      }));

      // Clear existing timeout
      if (dateChangeTimeout) {
        clearTimeout(dateChangeTimeout);
      }

      // Set new timeout to debounce API calls
      const timeout = window.setTimeout(async () => {
        if (selectedRoom && date) {
          try {
            const reserved = await roomService.getReservedSlots({
              roomNumber: selectedRoom.roomNumber,
              date: date.toISOString().split("T")[0],
            });
            
            // Rezerve edilmiş slotların formatını ve doğruluğunu kontrol edin
            const validReservedSlots = reserved.filter(slot => {
              // HH:MM-HH:MM formatına uygun mu kontrol et
              const isValidFormat = /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(slot);
              if (!isValidFormat) {
                console.error("Invalid slot format received from API (date change):", slot);
                return false;
              }
              return true;
            });
            
            setReservedSlots(validReservedSlots);
            console.log("Reserved slots (date change):", validReservedSlots);
            console.log(
              "Time slot periods:",
              timeSlotPeriods.map((slot) => `${slot.start}-${slot.end}`)
            );
          } catch (error: any) {
            console.error("Error loading reserved slots:", error);
            // Don't show error for rate limiting, just keep existing slots
            if (error.response?.status !== 429) {
              setReservedSlots([]);
            }
          }
        } else {
          setReservedSlots([]);
        }
      }, 500); // Wait 500ms before making API call

      setDateChangeTimeout(timeout);
    },
    [selectedRoom, dateChangeTimeout, timeSlotPeriods]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dateChangeTimeout) {
        clearTimeout(dateChangeTimeout);
      }
    };
  }, [dateChangeTimeout]);
  const renderRoomFeatures = (room: RoomMatch["room"]) => {
    const features = [];

    if (room.hasProjector)
      features.push(
        <Chip
          key="projector"
          icon={<ProjectorIcon />}
          label="Projector"
          size="small"
        />
      );
    if (room.hasAirConditioner)
      features.push(
        <Chip
          key="ac"
          icon={<AirIcon />}
          label="Air Conditioning"
          size="small"
        />
      );
    if (room.hasMicrophone)
      features.push(
        <Chip
          key="mic"
          icon={<MicIcon />}
          label="Microphone"
          size="small"
        />
      );
    if (room.hasCamera)
      features.push(
        <Chip
          key="camera"
          icon={<CameraIcon />}
          label="Camera"
          size="small"
        />
      );
    if (room.hasNoiseCancelling)
      features.push(
        <Chip
          key="quiet"
          icon={<QuietIcon />}
          label="Quiet"
          size="small"
        />
      );
    if (room.hasNaturalLight)
      features.push(
        <Chip
          key="light"
          icon={<LightIcon />}
          label="Natural Light"
          size="small"
        />
      );

    return features;
  };

  return (
    <NavBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          px: 1,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            py: 2,
            mb: 1,
          }}
        >
          {showWelcome && (
            <Box sx={{ maxWidth: 900, mx: "auto", mb: 4, overflow: "hidden" }}>
              {/* Main Welcome Card */}
              <Paper
                elevation={6}
                sx={{
                  p: 2,
                  mb: 2,
                  textAlign: "center",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: 3,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,

                    zIndex: 0,
                  },
                }}
              >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      background: "linear-gradient(45deg, #fff 30%, #f0f8ff 90%)",
                      backgroundClip: "text",
                      maxHeight: 300,
                    }}
                  >
                    Welcome to RoomGPT
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      opacity: 0.9,
                      fontWeight: 400,
                    }}
                  >
                    AI-Powered Smart Room Booking System
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      opacity: 0.8,
                      maxWidth: 600,
                      mx: "auto",
                    }}
                  >
                    Simply describe what you need in natural language, and our AI will find the perfect room for you
                  </Typography>
                </Box>
              </Paper>

              {/* Example Prompts Section */}
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    textAlign: "center",
                  }}
                >
                  ✨ Try these example prompts to get started:
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {examplePrompts.map((example, index) => (
                    <Paper
                      key={index}
                      elevation={2}
                      sx={{
                        p: 3,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        borderLeft: "4px solid #667eea",
                        background: "white",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          borderLeftColor: "#764ba2",
                        },
                      }}
                      onClick={() => handleExampleClick(example)}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,

                            background: "linear-gradient(45deg, #667eea, #764ba2)",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#2c3e50",
                            fontWeight: 500,
                            lineHeight: 1.5,
                          }}
                        >
                          "{example}"
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>

                {/* Features Section */}
                <Box sx={{ mt: 4, pt: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      color: "#7f8c8d",
                      mb: 2,
                      fontStyle: "italic",
                    }}
                  >
                    🎯 Our AI understands natural language and finds rooms based on your specifications.
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
          {messages.map((msg, index) => {
            if (msg.role === "assistant-rooms") {
              return (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    alignSelf: "flex-start",
                    backgroundColor: "#f0f0f0",
                    maxWidth: "90%",
                    overflow: "hidden",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#000",
                      mb: 2,
                      fontWeight: "bold",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                  </Typography>

                  {msg.data.rooms.length > 0 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {msg.data.rooms.map((room, roomIndex) => (
                        <Card
                          key={roomIndex}
                          sx={{ width: "100%", position: "relative" }}
                        >
                          <CardContent>
                            {/* Sadece ilk oda için Best Match etiketi göster */}
                            {roomIndex === 0 && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 12,
                                  right: 16,
                                  background: "#19d929ff",
                                  color: "#fff",
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: "8px",
                                  fontSize: "0.85rem",
                                  fontWeight: 500,
                                  zIndex: 2,
                                  boxShadow: 1,
                                }}
                              >
                                Best Match
                              </Box>
                            )}

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <Typography
                                variant="h6"
                                component="h3"
                                sx={{
                                  wordBreak: "break-word",
                                  overflowWrap: "break-word",
                                }}
                              >
                                {room.roomNumber}
                              </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                <PeopleIcon
                                  sx={{
                                    fontSize: 16,
                                    mr: 0.5,
                                    verticalAlign: "middle",
                                  }}
                                />
                                Capacity: {room.room.capacity} people
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                <RoomIcon
                                  sx={{
                                    fontSize: 16,
                                    mr: 0.5,
                                    verticalAlign: "middle",
                                  }}
                                />
                                Type: {room.room.roomType === "classroom" ? "Classroom" : "Study Room"}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Floor: {room.room.floor}, Area: {room.room.areaSqm}m²
                              </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="body2"
                                sx={{ mb: 1, fontWeight: "medium" }}
                              >
                                Features:
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {renderRoomFeatures(room.room)}
                              </Box>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="body2"
                                sx={{ mb: 1, fontWeight: "medium" }}
                              >
                                Compatibility Reasons:
                              </Typography>
                              {room.matchReasons.map((reason, reasonIndex) => (
                                <Typography
                                  key={reasonIndex}
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    fontSize: "0.85rem",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    whiteSpace: "pre-wrap",
                                    mb: 0.5,
                                  }}
                                >
                                  • {reason}
                                </Typography>
                              ))}
                            </Box>

                            <Button
                              fullWidth
                              variant="outlined"
                              onClick={() => handleRoomBooking(room, msg.data.requirements)}
                              disabled={loading}
                            >
                              Book Now
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Alert severity="info">No rooms found matching your criteria. Please try searching with different criteria.</Alert>
                  )}
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
                    overflow: "hidden",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  <Typography
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                  </Typography>
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
            inputProps={{ maxLength: 275 }}
            maxRows={6}
            placeholder="Describe your room needs in natural language... e.g. 'We need a presentation room for 5 people, with projector and air conditioning'"
            variant="outlined"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            sx={{
              "& .MuiInputBase-root": {
                minHeight: 60,
                overflow: "auto",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
                alignItems: "flex-start", // Yazı yukarıdan başlasın
                // Standart padding
              },
              "& .MuiInputBase-input": {
                minHeight: 60,
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
                resize: "none",
                verticalAlign: "top", // Yazı yukarıdan başlasın
                padding: 0,
              },
              "& .MuiOutlinedInput-root": {
                overflow: "hidden",
              },
            }}
          />
          <Button
            variant="outlined"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ height: "60px", minWidth: "100px" }} // Yüksekliği artır
          >
            Search
          </Button>
        </Box>

        {/* Booking Dialog */}
        <Dialog
          open={bookingDialogOpen}
          onClose={() => setBookingDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Make a Reservation - {selectedRoom?.roomNumber}</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <Box sx={{ minWidth: 180, flex: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label={bookingDetails.startDatetime ? "" : "Reservation Date"}
                      views={["day", "month"]}
                      value={bookingDetails.startDatetime ? new Date(bookingDetails.startDatetime) : null}
                      onChange={handleDateChange}
                      disablePast
                      minDate={new Date(new Date().getFullYear(), 0, 1)}
                      maxDate={new Date(new Date().getFullYear(), 11, 31)}
                      slotProps={{
                        textField: { fullWidth: true, required: true },
                      }}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ minWidth: 180, flex: 1, height: "100%" }}>
                  <FormControl fullWidth>
                    <InputLabel
                      id="time-slot-label"
                      sx={{ fontSize: 16 }}
                    >
                      {bookingDetails.startTime ? "" : "Time Slot"}
                    </InputLabel>
                    <Select
                      value={bookingDetails.startTime ? `${bookingDetails.startTime}-${bookingDetails.endTime}` : ""}
                      label="Time Slot"
                      onChange={(e) => {
                        const [start, end] = e.target.value.split("-");
                        setBookingDetails((prev) => ({
                          ...prev,
                          startTime: start,
                          endTime: end,
                        }));
                      }}
                      sx={() => ({
                        minHeight: 56,
                        display: "flex",
                        alignItems: "center",
                      })}
                    >
                      <MenuItem value="">Select time slot</MenuItem>
                      {timeSlotPeriods.map((slot) => {
                        const slotRange = `${slot.start}-${slot.end}`;
                        
                        // Check if this exact time slot or overlapping time slot is reserved
                        const isDisabled = reservedSlots.some((reservedSlot) => {
                          // Exact match check
                          if (reservedSlot === slotRange) {
                            return true;
                          }

                          // Overlap check - but only if there's actual time conflict
                          return timeSlotOverlaps(slot.start, slot.end, reservedSlot);
                        });

                        return (
                          <MenuItem
                            key={slot.label}
                            value={`${slot.start}-${slot.end}`}
                            disabled={isDisabled}
                            sx={{
                              opacity: isDisabled ? 0.6 : 1,
                              backgroundColor: isDisabled ? "#f5f5f5" : "inherit",
                              color: isDisabled ? "#999" : "inherit",
                              "&:hover": {
                                backgroundColor: isDisabled ? "#f5f5f5" : "rgba(0, 0, 0, 0.04)",
                              },
                              "&.Mui-disabled": {
                                backgroundColor: "#e8e8e8",
                                color: "#999",
                              },
                            }}
                          >
                            {slot.label} {isDisabled && "(Reserved)"}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Purpose (Optional)"
                multiline
                rows={3}
                value={bookingDetails.purpose}
                onChange={(e) =>
                  setBookingDetails((prev) => ({
                    ...prev,
                    purpose: e.target.value,
                  }))
                }
                sx={{
                  mb: 2,
                  "& .MuiInputLabel-root": {
                    color: "#ccc",
                  },
                  "& .MuiInputBase-root": {
                    minHeight: "80px",
                  },
                  "& .MuiInputBase-input": {
                    padding: "12px",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    resize: "none",
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button
              onClick={() => setBookingDialogOpen(false)}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBookingSubmit}
              variant="outlined"
              disabled={loading || !bookingDetails.startDatetime || !bookingDetails.startTime || !bookingDetails.endTime}
              sx={{ minWidth: "120px", minHeight: "40px" }}
            >
              {loading ? <CircularProgress size={20} /> : "Book Room"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </NavBar>
  );
}

export default HomePage;
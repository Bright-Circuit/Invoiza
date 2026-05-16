"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, Typography, Button, Grid } from "@mui/material";

export default function HomePage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Wait for splash screen to complete (approximately 4 seconds)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const globalKeyframes = `
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-40px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(40px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
  `;

  return (
    <>
      <style>{globalKeyframes}</style>
      <Box
        sx={{
          pt: { xs: 6, md: 10 },
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Hero Section */}
        <Container
          maxWidth="xl"
          sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, md: 4 } }}
        >
          <Grid container spacing={4} alignItems="center">
            {/* Left Content */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                animation: isVisible
                  ? "slideInLeft 1s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  : "none",
              }}
            >
              {/* Heading with staggered animation */}
              <Typography
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "6rem" },
                  fontWeight: 700,
                  lineHeight: 0.6,
                  mb: 2,
                  color: "#000",
                  animation: isVisible ? "fadeInUp 0.8s ease-out" : "none",
                }}
              >
                Get Paid Faster
              </Typography>

              {/* Second line with gradient */}
              <Box
                sx={{
                  animation: isVisible
                    ? "fadeInUp 0.8s ease-out 0.15s both"
                    : "none",
                  display: "inline-block",
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "2.5rem", sm: "3.5rem", md: "6rem" },
                    fontWeight: 700,
                    lineHeight: 0.8,
                    color: "#000",
                    display: "inline",
                  }}
                >
                  with{" "}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: "2.5rem", sm: "3.5rem", md: "6rem" },
                    fontWeight: 700,
                    background:
                      "linear-gradient(90deg, #7161EF 0%, #897bf1d2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline",
                  }}
                >
                  Invoiza
                </Typography>
              </Box>

              {/* Description */}
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "#666666",
                  mb: 4,
                  lineHeight: 1.6,
                  animation: isVisible
                    ? "fadeInUp 0.8s ease-out 0.3s both"
                    : "none",
                }}
              >
                Automate your billing, track expenses, and manage client
                relationships in one light-mode ready dashboard designed for
                modern businesses.
              </Typography>

              {/* CTA Buttons with staggered animation */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  onClick={() => router.push("/auth/login")}
                  variant="contained"
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    padding: "10px 32px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: "10px",
                    textTransform: "none",
                    animation: isVisible
                      ? "fadeInUp 0.8s ease-out 0.45s both"
                      : "none",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    "&:hover": {
                      backgroundColor: "primary.hover",
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 24px rgba(99, 102, 241, 0.3)",
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  onClick={() => router.push("#")}
                  variant="outlined"
                  sx={{
                    color: "primary.main",
                    borderColor: "primary.main",
                    padding: "10px 32px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: "10px",
                    textTransform: "none",
                    border: "2px solid #7161EF",
                    animation: isVisible
                      ? "fadeInUp 0.8s ease-out 0.55s both"
                      : "none",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.04)",
                      borderColor: "primary.hover",
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 24px rgba(99, 102, 241, 0.2)",
                    },
                  }}
                >
                  Explore More
                </Button>
              </Box>
            </Grid>

            {/* Right Image */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                animation: isVisible
                  ? "slideInRight 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both"
                  : "none",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  animation: isVisible
                    ? "scaleIn 0.8s ease-out 0.4s both"
                    : "none",
                  perspective: "1000px",
                }}
              >
                {/* Add image for here */}
                <img
                  src="/images/home-hero/home-hero.png"
                  alt="Dashboard Mockup"
                  style={{
                    width: "100%",
                    height: "auto",
                    filter: isVisible
                      ? "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.1))"
                      : "drop-shadow(0 0 0px rgba(0, 0, 0, 0))",
                    transition: "filter 0.6s ease-out",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: "#f9fafb" }}>
        <Container maxWidth="lg">
          {/* Section Title */}
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                fontWeight: 600,
                color: "#000",
                mb: 3,
              }}
            >
              Everything you need to manage finance
            </Typography>
            <Typography
              sx={{
                fontSize: "1.05rem",
                color: "#6b7280",
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Our platform provides comprehensive tools to streamline your invoicing,
              accounting, and client management processes in one place.
            </Typography>
          </Box>

          {/* Features Grid */}
          <Grid container spacing={4}>
            {/* Feature 1: Smart Automation */}
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  bg: "white",
                  p: { xs: 4, md: 5 },
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #c7d2fe 0%, #e0e7ff 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    fontSize: "1.5rem",
                  }}
                >
                  🔄
                </Box>

                {/* Title */}
                <Typography
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#1f2937",
                    mb: 2,
                  }}
                >
                  Smart Automation
                </Typography>

                {/* Description */}
                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    color: "#6b7280",
                    lineHeight: 1.6,
                  }}
                >
                  Set up recurring invoices once and never worry about missing a billing
                  cycle again. We handle the reminders.
                </Typography>
              </Box>
            </Grid>

            {/* Feature 2: Real-time Analytics */}
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  bg: "white",
                  p: { xs: 4, md: 5 },
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #c7d2fe 0%, #e0e7ff 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    fontSize: "1.5rem",
                  }}
                >
                  📊
                </Box>

                {/* Title */}
                <Typography
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#1f2937",
                    mb: 2,
                  }}
                >
                  Real-time Analytics
                </Typography>

                {/* Description */}
                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    color: "#6b7280",
                    lineHeight: 1.6,
                  }}
                >
                  Visualize cash flow, track expenses, and monitor profit margins with
                  intuitive, real-time charts.
                </Typography>
              </Box>
            </Grid>

            {/* Feature 3: Payment Integration */}
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  bg: "white",
                  p: { xs: 4, md: 5 },
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #c7d2fe 0%, #e0e7ff 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    fontSize: "1.5rem",
                  }}
                >
                  💳
                </Box>

                {/* Title */}
                <Typography
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#1f2937",
                    mb: 2,
                  }}
                >
                  Payment Integration
                </Typography>

                {/* Description */}
                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    color: "#6b7280",
                    lineHeight: 1.6,
                  }}
                >
                  Accept credit cards, ACH, and PayPal payments instantly with secure
                  gateways integrated directly into invoices.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ bg: "#ffffff", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
          {/* Section Header */}
          <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
            <Typography
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                color: "#1f2937",
                mb: 3,
                animation: isVisible
                  ? "fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  : "none",
              }}
            >
              Simple, Transparent Pricing
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.1rem" },
                color: "#6b7280",
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.7,
                animation: isVisible
                  ? "fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both"
                  : "none",
              }}
            >
              Choose the perfect plan for your business. Scale as you grow with flexible pricing.
            </Typography>
          </Box>

          {/* Pricing Cards Grid */}
          <Grid container spacing={4} justifyContent="center">
            {/* Basic Plan */}
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  bg: "white",
                  p: { xs: 4, md: 5 },
                  borderRadius: "16px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                  animation: isVisible
                    ? "fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both"
                    : "none",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                    borderColor: "#7161EF",
                  },
                }}
              >
                {/* Plan Name */}
                <Typography
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#1f2937",
                    mb: 2,
                  }}
                >
                  Starter
                </Typography>

                {/* Price */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    sx={{
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color: "#1f2937",
                    }}
                  >
                    $29
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#6b7280",
                      mt: 1,
                    }}
                  >
                    per month
                  </Typography>
                </Box>

                {/* CTA Button */}
                <Button
                  fullWidth
                  sx={{
                    mb: 4,
                    py: 1.5,
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    backgroundColor: "#f3f4f6",
                    color: "#1f2937",
                    border: "1px solid #e5e7eb",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#e5e7eb",
                    },
                  }}
                >
                  Get Started
                </Button>

                {/* Features List */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {["Up to 100 invoices", "Basic reports", "Email support", "Single user"].map(
                    (feature, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Typography sx={{ fontSize: "1.2rem", color: "#7161EF" }}>✓</Typography>
                        <Typography sx={{ fontSize: "0.95rem", color: "#666666" }}>
                          {feature}
                        </Typography>
                      </Box>
                    )
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Professional Plan (Featured) */}
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  bg: "white",
                  p: { xs: 4, md: 5 },
                  borderRadius: "16px",
                  border: "2px solid #7161EF",
                  boxShadow: "0 8px 24px rgba(113, 97, 239, 0.15)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  animation: isVisible
                    ? "fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s both"
                    : "none",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 40px rgba(113, 97, 239, 0.2)",
                  },
                }}
              >
                {/* Popular Badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#7161EF",
                    color: "white",
                    px: 3,
                    py: 0.5,
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Most Popular
                </Box>

                {/* Plan Name */}
                <Typography
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#1f2937",
                    mb: 2,
                    mt: 2,
                  }}
                >
                  Professional
                </Typography>

                {/* Price */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    sx={{
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color: "#1f2937",
                    }}
                  >
                    $79
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#6b7280",
                      mt: 1,
                    }}
                  >
                    per month
                  </Typography>
                </Box>

                {/* CTA Button */}
                <Button
                  fullWidth
                  sx={{
                    mb: 4,
                    py: 1.5,
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    backgroundColor: "#7161EF",
                    color: "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#5a4bd4",
                      boxShadow: "0 8px 20px rgba(113, 97, 239, 0.3)",
                    },
                  }}
                >
                  Start Free Trial
                </Button>

                {/* Features List */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[
                    "Up to 1,000 invoices",
                    "Advanced reports",
                    "Priority email support",
                    "Up to 5 users",
                    "Custom branding",
                  ].map((feature, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ fontSize: "1.2rem", color: "#7161EF" }}>✓</Typography>
                      <Typography sx={{ fontSize: "0.95rem", color: "#666666" }}>
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Enterprise Plan */}
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  bg: "white",
                  p: { xs: 4, md: 5 },
                  borderRadius: "16px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                  animation: isVisible
                    ? "fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s both"
                    : "none",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                    borderColor: "#7161EF",
                  },
                }}
              >
                {/* Plan Name */}
                <Typography
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#1f2937",
                    mb: 2,
                  }}
                >
                  Enterprise
                </Typography>

                {/* Price */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    sx={{
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color: "#1f2937",
                    }}
                  >
                    Custom
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#6b7280",
                      mt: 1,
                    }}
                  >
                    tailored pricing
                  </Typography>
                </Box>

                {/* CTA Button */}
                <Button
                  fullWidth
                  sx={{
                    mb: 4,
                    py: 1.5,
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    backgroundColor: "#f3f4f6",
                    color: "#1f2937",
                    border: "1px solid #e5e7eb",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#e5e7eb",
                    },
                  }}
                >
                  Contact Sales
                </Button>

                {/* Features List */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[
                    "Unlimited invoices",
                    "Custom integrations",
                    "Dedicated support",
                    "Unlimited users",
                    "Advanced security",
                    "SLA guarantee",
                  ].map((feature, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ fontSize: "1.2rem", color: "#7161EF" }}>✓</Typography>
                      <Typography sx={{ fontSize: "0.95rem", color: "#666666" }}>
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

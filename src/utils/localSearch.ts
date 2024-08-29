"use client";

var term: string | null;

export function getLocalTerm() {
  if (typeof window !== "undefined") {
    term = localStorage.getItem("searchTerm");
  }
  if (!term) { setLocalTerm("sequoia sempervirens") }
}

export function setLocalTerm(searchTerm: string) {
  localStorage.setItem("searchTerm", searchTerm);
}
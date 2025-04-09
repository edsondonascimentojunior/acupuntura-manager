"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const AgendamentoPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("Auriculoterapia");

  const appointmentTypes = [
    "Auriculoterapia",
    "Ventosaterapia",
    "Acupuntura Sistêmica",
    "Auriculoterapia + Ventosaterapia",
    "Auriculoterapia + Acupuntura Sistêmica",
  ];

  useEffect(() => {
    axios
      .get("http://https://acupuntura-manager.onrender.com/api/pacientes")
      .then((response) => setPatients(response.data))
      .catch((error) =>
        console.error("Erro ao carregar pacientes:", error)
      );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://https://acupuntura-manager.onrender.com/api/agendamentos", {
        pacienteId: selectedPatient,
        data: appointmentDate,
        horario: appointmentTime,
        tipoDeAtendimento: appointmentType, // campo correto do schema.prisma
      });

      alert("Consulta agendada com sucesso!");
      setSelectedPatient("");
      setAppointmentDate("");
      setAppointmentTime("");
      setAppointmentType("Auriculoterapia");
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      alert("Erro ao agendar consulta.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">
        Agendamento de Consulta
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Paciente:</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            required
          >
            <option value="">Selecione um paciente</option>
            {patients.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Data:</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Horário:</label>
          <input
            type="time"
            className="w-full p-2 border rounded"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Tipo de Atendimento:</label>
          <select
            className="w-full p-2 border rounded"
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value)}
            required
          >
            {appointmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700"
        >
          Agendar Consulta
        </button>
      </form>
    </div>
  );
};

export default AgendamentoPage;

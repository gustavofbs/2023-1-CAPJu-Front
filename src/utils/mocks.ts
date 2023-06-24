export const mockedUser = {
  cpf: "12345678900",
  fullName: "User Teste",
  email: "test@test.com",
  idUnit: 1,
  token: "mocked-token",
  idRole: 1,
  expiresIn: "2100-06-19T03:26:25.050Z",
};

export const mockedAdminUser = {
  ...mockedUser,
  idRole: 5,
};

export const mockedManagerUser = {
  ...mockedUser,
  idRole: 1,
};

export const mockedUnits = [
  {
    idUnit: 1,
    name: "Unidade 1",
  },
  {
    idUnit: 2,
    name: "Unidade 2",
  },
  {
    idUnit: 3,
    name: "Unidade 3",
  },
  {
    idUnit: 4,
    name: "Unidade 4",
  },
  {
    idUnit: 5,
    name: "Unidade 5",
  },
];

export const mockedStages = [
  {
    idStage: 1,
    idUnit: 1,
    name: "etapaA",
    duration: 2,
  },
  {
    idStage: 2,
    idUnit: 1,
    name: "etapaB",
    duration: 3,
  },
  {
    idStage: 3,
    idUnit: 1,
    name: "etapaC",
    duration: 5,
  },
];

export const mockedFlow = {
  idFlow: 1,
  name: "Fluxo 1",
  idUnit: 1,
  stages: [1, 2],
  sequences: [{ from: 1, commentary: "Comentário", to: 2 }],
};

export const mockedFlows = [
  {
    idFlow: 1,
    name: "Fluxo 1",
    idUnit: 1,
    stages: [1, 2],
    sequences: [{ from: 1, commentary: "Comentário", to: 2 }],
  },
  {
    idFlow: 2,
    name: "Fluxo 2",
    idUnit: 1,
    stages: [1, 2],
    sequences: [{ from: 1, commentary: "Comentário", to: 2 }],
  },
  {
    idFlow: 3,
    name: "Fluxo 3",
    idUnit: 1,
    stages: [1, 2],
    sequences: [{ from: 1, commentary: "Comentário", to: 2 }],
  },
];

export const mockedNotStartedProcess = {
  effectiveDate: null,
  idFlow: 1,
  idPriority: 0,
  idStage: null,
  idUnit: 1,
  nickname: "Apelido do Processo",
  record: "12345678912345678915",
  status: "notStarted",
};

export const mockedProcesses = [
  {
    effectiveDate: null,
    idFlow: 1,
    idPriority: 1,
    idStage: null,
    idUnit: 1,
    nickname: "Apelido do Processo",
    record: "12345678912345678915",
    status: "notStarted",
  },
  {
    effectiveDate: new Date(),
    idFlow: 1,
    idPriority: 1,
    idStage: 1,
    idUnit: 1,
    nickname: "Processo em Andamento",
    record: "12345678912345678916",
    status: "notStarted",
  },
  {
    effectiveDate: new Date(),
    idFlow: 1,
    idPriority: null,
    idStage: null,
    idUnit: 1,
    nickname: "Processo Finalizado",
    record: "12345678912345678917",
    status: "finished",
  },
];

export const mockedPriorities = [
  {
    idPriority: 1,
    description: "Art. 1048, II. Do CPC (ECA)",
  },
];

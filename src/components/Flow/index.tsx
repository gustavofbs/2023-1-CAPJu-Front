import { Card, Skeleton } from "@chakra-ui/react";
import { useMemo } from "react";
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import _ from "lodash";

import { colors } from "styles/colors";

interface FlowProps {
  stages: Stage[];
  sequences: FlowSequence[];
  width?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  currentStage?: string | number | undefined;
  effectiveDate?: string | undefined;
  isFetching?: boolean;
  showStagesDuration?: boolean;
  process: Process;
}

export function Flow({
  stages,
  sequences,
  width = "100%",
  maxWidth = "unset",
  minHeight = 350,
  currentStage = undefined,
  effectiveDate = undefined,
  isFetching = false,
  showStagesDuration = false,
  process,
}: FlowProps) {
  const startDate = effectiveDate ? new Date(effectiveDate) : null;
  const sortedStages = useMemo(() => {
    const sequenceMap = new Map<number, number>();

    sequences.forEach((sequence, index) => {
      sequenceMap.set(sequence.from, index);
    });

    let index = 0;

    return stages.sort((a, b) => {
      a.entrada = process?.progress && process?.progress[index]?.entrada;
      a.vencimento = process?.progress && process?.progress[index]?.vencimento;
      const indexA = sequenceMap.get(a.idStage);
      const indexB = sequenceMap.get(b.idStage);

      if (indexA === undefined && indexB === undefined) {
        return 0;
      }

      if (indexA === undefined) {
        return 1;
      }

      if (indexB === undefined) {
        return -1;
      }
      index += 1;
      return indexA - indexB;
    });
  }, [stages, sequences]);

  const getStageDeadline = (item: Stage, index: number): string | null => {
    if (!startDate || !effectiveDate) return null;

    const previousDuration = stages.reduce((acc, curr, reduceIndex) => {
      if (index <= reduceIndex) return acc;

      return acc + curr.duration + 1;
    }, 0);

    const stageStartDate = new Date(startDate);
    stageStartDate.setDate(startDate.getDate() + previousDuration);

    const stageEndDate = new Date(stageStartDate);
    stageEndDate.setDate(stageEndDate.getDate() + item.duration);

    return stageEndDate.toLocaleString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleStartDateFormating = (date: string) => {
    const currentDate = new Date(date);
    return currentDate.toLocaleString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleStartDueDateFormating = () => {
    const initialExpirationDate = new Date(process?.effectiveDate);
    initialExpirationDate.setDate(
      initialExpirationDate.getDate() + stages[0].duration
    );
    return initialExpirationDate.toLocaleString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const nodes = sortedStages.map((item, index) => {
    const deadline = getStageDeadline(item, index);
    const stageLabel = `${_.startCase(item.name)}, ${
      showStagesDuration
        ? ` (${item.duration} dia${item.duration > 1 ? "s" : ""})`
        : ""
    }`;
    return {
      id: `${item.idStage}`,
      position: {
        x: 30 + index * 60,
        y: 30 + index * (currentStage ? 125 : 100),
      },
      data: {
        label: (
          <>
            {stageLabel}
            <>
              {" "}
              {(item?.entrada || index === 0) && <br />}
              {item?.vencimento
                ? `Entrada: ${item.entrada}`
                : index === 0 &&
                  `Entrada: ${handleStartDateFormating(
                    process?.effectiveDate
                  )}`}
              <br />
              {item?.vencimento
                ? `Vencimento: ${item.vencimento}`
                : index === 0 && `Vencimento: ${handleStartDueDateFormating()}`}
              {/* {item?.vencimento
                ? `Vencimento: ${item.vencimento}`
                : index === 0
                ? `Vencimento: ${handleStartDueDateFormating()}`
                : `Vencimento: ${item.duration} dia(s) após a data de entrada`} */}
            </>
          </>
        ),
      },
      style: {
        ...(currentStage === item.idStage
          ? {
              color: "white",
              background: colors.green["500"],
              fontWeight: "bold",
            }
          : {
              background: colors.gray["200"],
            }),
        width: deadline ? 240 : 180,
      },
    } as Node;
  });

  const edges = sequences.map((item) => {
    return {
      id: `edge-${item.from}-${item.to}`,
      source: `${item.from}`,
      target: `${item.to}`,
      animated: currentStage === item.from,
      style: {
        stroke: currentStage === item.from ? "#1b9454" : colors.gray["200"],
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: "black" },
    } as Edge;
  });

  return isFetching ? (
    <Skeleton w={width} maxW={maxWidth} h={minHeight} />
  ) : (
    <>
      {!!nodes.length && !!edges.length ? (
        <Card
          variant="elevated"
          w={width}
          maxW={maxWidth}
          minH={minHeight}
          css={{ "> *": { flex: 1 } }}
        >
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Controls />
            <Background />
          </ReactFlow>
        </Card>
      ) : null}
    </>
  );
}

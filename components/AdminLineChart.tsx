import React from "react";
import { Platform, View } from "react-native";
import styles from "@/styles/pages/AdminLineChartStyle";

type Props = {
    labels: string[];
    values: number[];
    lineColor: string;
};

export default function AdminLineChart({ labels, values, lineColor }: Props) {
    if (Platform.OS !== "web") {
        return <View style={styles.fallback} />;
    }

    const width = 520;
    const height = 140;
    const paddingX = 22;
    const paddingY = 18;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);

    const stepX = (width - paddingX * 2) / Math.max(1, values.length - 1);

    const pts = values.map((v, i) => {
        const x = paddingX + i * stepX;
        const y = paddingY + (1 - (v - min) / range) * (height - paddingY * 2);
        return { x, y };
    });

    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    return (
        // @ts-ignore web svg
        <svg width="100%" height={height + 28} viewBox={`0 0 ${width} ${height + 28}`} style={{ display: "block" }}>
            {[0, 1, 2, 3, 4].map((i) => {
                const y = paddingY + (i * (height - paddingY * 2)) / 4;
                return (
                    // @ts-ignore
                    <line
                        key={i}
                        x1={paddingX}
                        x2={width - paddingX}
                        y1={y}
                        y2={y}
                        stroke="rgba(0,0,0,0.08)"
                        strokeWidth="1"
                        strokeDasharray="3 4"
                    />
                );
            })}

            {/* @ts-ignore */}
            <path d={d} fill="none" stroke={lineColor} strokeWidth="4" strokeLinecap="round" />

            {pts.map((p, i) => (
                // @ts-ignore
                <circle key={i} cx={p.x} cy={p.y} r="3.6" fill={lineColor} />
            ))}

            {labels.map((lab, i) => {
                const x = paddingX + i * stepX;
                return (
                    // @ts-ignore
                    <text key={i} x={x} y={height + 22} textAnchor="middle" fontSize="11" fill="rgba(0,0,0,0.55)">
                        {lab}
                    </text>
                );
            })}
        </svg>
    );
}

"use client"

import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import html2canvas from "html2canvas"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function BoardActions() {
    // Save as PNG (SVG to PNG conversion)
    const handleSavePNG = () => {
        const board = document.querySelector('[data-tactics-board]') as HTMLElement;
        if (!board) return;
        const svg = board.querySelector('svg');
        if (!svg) return;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const img = new window.Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 1280;
            canvas.height = 853;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#22c55e";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const defaultName = `tactics-board-${Date.now()}.png`;
            const filename = window.prompt("Enter a filename for your image:", defaultName) || defaultName;
            const link = document.createElement("a");
            link.download = filename;
            link.href = canvas.toDataURL("image/png");
            link.click();
            URL.revokeObjectURL(url);
        };
        img.onerror = () => {
            alert("Failed to export image.");
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }

    // Save as SVG
    const handleSaveSVG = () => {
        const board = document.querySelector('[data-tactics-board]') as HTMLElement;
        if (!board) return;
        const svg = board.querySelector('svg');
        if (!svg) return;
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svg);
        if (!svgString.startsWith('<?xml')) {
            svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
        }
        if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
            svgString = svgString.replace(
                '<svg',
                '<svg xmlns="http://www.w3.org/2000/svg"'
            );
        }
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const defaultName = `tactics-board-${Date.now()}.svg`;
        const filename = window.prompt("Enter a filename for your SVG:", defaultName) || defaultName;
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }
    return (
        <div className="flex items-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleSavePNG}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSavePNG}>Save as PNG</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSaveSVG}>Save as SVG</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

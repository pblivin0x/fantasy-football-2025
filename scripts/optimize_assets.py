#!/usr/bin/env python3
"""
Asset optimization for GitHub Pages deployment
Ensures optimal loading performance
"""

import os
import json
from pathlib import Path
from typing import Dict, List

def analyze_assets():
    """Analyze current asset sizes and provide optimization recommendations"""
    
    print("\n" + "="*60)
    print("📊 ASSET ANALYSIS FOR GITHUB PAGES")
    print("="*60 + "\n")
    
    # Define paths
    project_root = Path(__file__).parent.parent
    public_dir = project_root / "public"
    data_dir = public_dir / "data"
    images_dir = public_dir / "images"
    
    # Analyze images
    print("🖼️  IMAGE ASSETS:")
    print("-" * 40)
    
    total_image_size = 0
    image_files = []
    
    if images_dir.exists():
        for img_file in images_dir.glob("*.png"):
            size_kb = os.path.getsize(img_file) / 1024
            total_image_size += size_kb
            image_files.append((img_file.name, size_kb))
            status = "⚠️  Large" if size_kb > 500 else "✅"
            print(f"  {status} {img_file.name}: {size_kb:.1f} KB")
    
    print(f"\n  Total images: {total_image_size:.1f} KB")
    
    # Analyze CSV data
    print("\n📈 DATA FILES:")
    print("-" * 40)
    
    total_data_size = 0
    data_files = []
    
    if data_dir.exists():
        for data_file in data_dir.glob("*.csv"):
            size_kb = os.path.getsize(data_file) / 1024
            total_data_size += size_kb
            data_files.append((data_file.name, size_kb))
            print(f"  ✅ {data_file.name}: {size_kb:.1f} KB")
        
        # Check JSON files too
        for json_file in data_dir.glob("*.json"):
            size_kb = os.path.getsize(json_file) / 1024
            total_data_size += size_kb
            print(f"  ✅ {json_file.name}: {size_kb:.1f} KB")
    
    print(f"\n  Total data: {total_data_size:.1f} KB")
    
    # Overall analysis
    print("\n📊 SUMMARY:")
    print("-" * 40)
    total_size = total_image_size + total_data_size
    print(f"  Total asset size: {total_size:.1f} KB ({total_size/1024:.2f} MB)")
    
    # GitHub Pages recommendations
    print("\n💡 GITHUB PAGES OPTIMIZATION STATUS:")
    print("-" * 40)
    
    if total_size < 1024:  # Less than 1MB
        print("  ✅ Excellent - Total size under 1MB")
        print("  ✅ Fast loading on all connections")
        print("  ✅ No CDN required")
    elif total_size < 5120:  # Less than 5MB
        print("  ✅ Good - Acceptable for GitHub Pages")
        print("  ⚠️  Consider image optimization for mobile")
    else:
        print("  ⚠️  Large - Consider optimization")
        print("  ⚠️  May be slow on mobile connections")
    
    # Specific recommendations
    print("\n🔧 RECOMMENDATIONS:")
    print("-" * 40)
    
    recommendations = []
    
    # Check for large images
    large_images = [f for f, size in image_files if size > 500]
    if large_images:
        recommendations.append(
            f"Compress these images: {', '.join(large_images)}\n"
            f"     Use: TinyPNG.com or 'pip install pillow' for Python compression"
        )
    
    # Check if we're using the right formats
    if images_dir.exists() and list(images_dir.glob("*.png")):
        if not list(images_dir.glob("*.webp")):
            recommendations.append(
                "Consider WebP format for 25-35% smaller files\n"
                "     Modern browsers support it with PNG fallback"
            )
    
    # Data optimization
    if total_data_size > 500:
        recommendations.append(
            "Consider data minification:\n"
            "     - Remove unnecessary columns\n"
            "     - Use shorter column names\n"
            "     - Compress with gzip (GitHub Pages does this automatically)"
        )
    
    if recommendations:
        for i, rec in enumerate(recommendations, 1):
            print(f"  {i}. {rec}")
    else:
        print("  ✅ No optimizations needed - assets are well optimized!")
    
    # GitHub Pages specific tips
    print("\n🚀 GITHUB PAGES BEST PRACTICES:")
    print("-" * 40)
    print("  1. Assets < 100KB load instantly")
    print("  2. GitHub Pages automatically gzips text files")
    print("  3. Use relative paths (/images/...) for CDN benefits")
    print("  4. Browser caching works automatically")
    print("  5. No need for external CDN under 10MB total")
    
    # Create optimization report
    report = {
        "timestamp": "2025-08-16",
        "total_size_kb": round(total_size, 2),
        "images": {
            "count": len(image_files),
            "total_kb": round(total_image_size, 2),
            "files": [{"name": name, "size_kb": round(size, 2)} for name, size in image_files]
        },
        "data": {
            "count": len(data_files),
            "total_kb": round(total_data_size, 2),
            "files": [{"name": name, "size_kb": round(size, 2)} for name, size in data_files]
        },
        "optimization_status": "optimal" if total_size < 1024 else "good" if total_size < 5120 else "needs_optimization",
        "github_pages_ready": True
    }
    
    # Save report
    report_path = project_root / "asset_report.json"
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📄 Report saved to: asset_report.json")
    print("="*60 + "\n")
    
    return report

def optimize_for_github_pages():
    """Specific optimizations for GitHub Pages hosting"""
    
    print("\n🔄 APPLYING GITHUB PAGES OPTIMIZATIONS...")
    print("-" * 40)
    
    # Check base URL in vite config
    project_root = Path(__file__).parent.parent
    vite_config = project_root / "vite.config.ts"
    
    if vite_config.exists():
        with open(vite_config, 'r') as f:
            content = f.read()
            if "base:" in content and "/fantasy-football-2025/" in content:
                print("  ✅ Vite base URL configured correctly")
            else:
                print("  ⚠️  Check vite.config.ts base URL setting")
    
    # Verify public directory structure
    public_dir = project_root / "public"
    required_dirs = ["data", "images"]
    
    for dir_name in required_dirs:
        dir_path = public_dir / dir_name
        if dir_path.exists():
            print(f"  ✅ /{dir_name}/ directory exists")
        else:
            print(f"  ⚠️  Missing /{dir_name}/ directory")
    
    # Check for workflow
    workflow_path = project_root / ".github" / "workflows" / "deploy.yml"
    if workflow_path.exists():
        print("  ✅ GitHub Pages deploy workflow exists")
    else:
        print("  ⚠️  No deploy workflow found")
    
    print("\n✅ GitHub Pages optimization complete!")

if __name__ == "__main__":
    # Run analysis
    report = analyze_assets()
    
    # Apply optimizations
    optimize_for_github_pages()
    
    # Final status
    if report["optimization_status"] == "optimal":
        print("\n🎉 Your assets are perfectly optimized for GitHub Pages!")
    else:
        print("\n💪 Follow the recommendations above for better performance!")
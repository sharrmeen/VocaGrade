def parse_textgrid_for_pronunciation(alignment_data):
    phones = []
    for segment in alignment_data["segments"]:
        for phone in segment.get("phones", []):
            phones.append({
                "phone": phone["label"],
                "start": phone["start"],
                "end": phone["end"],
                "duration": phone["duration"],
                "score": phone.get("score", None)
            })

    avg_duration = sum(p["duration"] for p in phones) / len(phones) if phones else 0
    bad_phones = [p for p in phones if p["score"] is not None and p["score"] < -2.0]

    return {
        "average_phone_duration": avg_duration,
        "mispronounced_phones": bad_phones,
        "feedback": (
            "Good job! Work on clearer articulation of certain sounds."
            if bad_phones else
            "Pronunciation was clear and accurate!"
        )
    }

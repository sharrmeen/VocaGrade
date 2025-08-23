def parse_textgrid_for_pronunciation(alignment_data):
    phones = []
    for segment in alignment_data.get("segments", []):
        for phone in segment.get("phones", []):
            phones.append({
                "phone": phone["label"],
                "start": phone["start"],
                "end": phone["end"],
                "duration": phone["duration"],
                "score": phone.get("score")
            })

    avg_duration = (
        sum(p["duration"] for p in phones) / len(phones)
        if phones else 0
    )
    mispronounced = [
        p for p in phones if p["score"] is not None and p["score"] < -2.0
    ]

    feedback = (
        "Pronunciation was clear and accurate!"
        if not mispronounced else
        "Good job! Work on clearer articulation of certain sounds."
    )

    return {
        "average_phone_duration": avg_duration,
        "mispronounced_phones": mispronounced,
        "feedback": feedback
    }

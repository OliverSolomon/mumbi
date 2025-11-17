-- Seed tributes data
-- Run this in Supabase SQL Editor after creating the tributes table

-- Note: These tributes will be inserted with user_id = NULL since they're seed data
-- In production, you may want to create a system user or handle this differently

INSERT INTO tributes (name, email, message, photo_url, is_anonymous, created_at)
VALUES
(
  'ANGELLINE MWANIKI',
  'angelline@example.com',
  'Though words fall short, I''ll honor the memory of my vibrant cousin, Mumbi, who always knew she was destined for greatness. Despite life''s hurdles, she walked her own path to the top, unwavering in her belief that she deserved the finest things. Her spirit chased dreams, and she proudly bought her dream car, She wore her heels every day because every day was special, and her beautiful short dresses showcased legs that truly deserved to be seen.

She owned the room whenever she walked in.

Mumbi, you left an indelible mark in our lives. Thank you for being a trendsetter, showing us what confidence and fearless living looks like.

Rest in peace, dear cousin.',
  NULL,
  false,
  '2025-11-15T00:00:00Z'::timestamptz
),
(
  'Lynda Sungu',
  'lynda@example.com',
  'My dear sister

Thank you for embracing me and taking me under your wing. Thank you for always opening the doors to your home for me. Thank you for the night outs, the wine, the company, the vibes, the food we shared, the gifts.

Thank you for sharing your wisdom and challenging me to be better, to grow, to be inspiring, to give back, to grow others. Thank you for loving me. Thank you for choosing me. God knew I needed you and He placed you in your life to elevate it. I hope you are in His arms resting, because you loved all, inspired all, helped all, challenged all. Rest now my love. I pray that I will make you proud and keep your memory alive. I''ll miss you Mumbi. I really miss you already...but God''s will...not mine.',
  NULL,
  false,
  '2025-11-15T00:00:00Z'::timestamptz
),
(
  'Stella Wanjohi',
  'stella@example.com',
  '✨ Goodbye Message for Cousin Mumbi ✨

This is incredibly hard for all of us. We will always remember you as hardworking, funny, stylish, and truly the life of every gathering. You lit up every room with your laughter, your charm, and your unstoppable energy. Your dedication inspired us, your humor kept us smiling, and your bold, beautiful style reminded us to live fully and confidently.

We will miss you deeply, but your spark stays with us. You continue to shine in our hearts, in our stories, and in the joy you brought into our lives.

Goodbye, Mumbi — you will forever be our jewel.',
  NULL,
  false,
  '2025-11-14T00:00:00Z'::timestamptz
),
(
  'jacinta mwikali',
  'jacinta@example.com',
  'My Forever living Champion, saying Goodbye to you is the hardest thing to do my Mumbi..

I first met Mumbi in 2014, in the simplest of moments—when she was selling shoes to me. Neither of us knew then that this encounter would mark the beginning of a remarkable journey. It was during that meeting that I introduced her to the Forever Business, and from that moment on, everything changed. Mumbi embraced the opportunity with a passion and dedication that transformed our business a full 360°.

Together, we worked hand in hand, growing, learning, empowering, and celebrating. Through her unwavering commitment, we qualified for all incentives, not by luck, but through teamwork, resilience, and the stability she helped build within our structure. Mumbi''s impact went far beyond our team—she contributed immensely to Forever Living Products as a whole, becoming a source of inspiration and an example of what belief, hard work, and consistency can achieve.

Her energy was contagious, her attitude always positive, and her presence filled every space with good vibes. She was not only a downline, but a sister, a leader, and a pillar in the Champions Team. Losing her on Tuesday, 11th November 2025, has left a void that words can hardly express. As Champions Team, we will deeply miss her strength, her laughter, and her unwavering spirit.

Mumbi, thank you for the light you brought into our lives and the legacy you leave behind. You changed our journeys forever, and your impact will continue to live on in the hearts and successes of everyone you touched.

May your beautiful soul rest in eternal peace.',
  NULL,
  false,
  '2025-11-14T00:00:00Z'::timestamptz
),
(
  'Sheilla Andanje',
  'sheilla@example.com',
  'Mumbi, Gal… I don''t even know how to say goodbye.

You were pure sunshine radiant, bubbly, beautiful to your very core. Stylish beyond measure, open-hearted, generous, kind, giving, and honorable in all the ways that mattered.

You were every good thing wrapped in one dazzling soul.You were light ,the kind that made people feel seen, safe, and alive. You lived, truly lived, and I am endlessly grateful that I got to meet you, laugh with you, share stories with you, and feel the magic of your energy.

Thank you for all the stories, the unfiltered talks, the inside jokes, the endless plugs, the laughter that still echoes. You gave of yourself so freely, and in doing so, you lit fires in all of us.

May all you ever wanted for the people you loved CRYSTALLIZE may your light continue to ripple through us, softly, powerfully, eternally.

Petitioning Angels Gabriel and Peter to let you rock your heels because those drab white robes just won''t cut it ❤️

You were love, Mumbi.
You are love.
Forever light. ✨',
  NULL,
  false,
  '2025-11-13T00:00:00Z'::timestamptz
)
ON CONFLICT DO NOTHING;


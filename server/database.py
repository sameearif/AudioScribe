import mysql.connector
from mysql.connector import IntegrityError

HOST = "localhost"
USER = "sameearif"
PASSWORD = "sameearif"
DATABASE = "tts_dataset"

def initialize_database(host, user, password, database):
    conn = mysql.connector.connect(
        host=host,
        user=user,
        password=password,
        database=database
    )
    return conn

def authenticate_login(username, password):
    conn = initialize_database(host=HOST, user=USER, password=PASSWORD, database=DATABASE)
    cursor = conn.cursor()
    query = "SELECT password, type FROM login WHERE username = %s"
    cursor.execute(query, (username,))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    if result:
        if password != result[0]:
            return (False, "", "Password is incorrect!")
        else:
            return (True, result[1], "")
    else:
        return (False, "Username does not exist!", "")
    
def create_user(name, username, password, type):
    conn = initialize_database(host=HOST, user=USER, password=PASSWORD, database=DATABASE)
    cursor = conn.cursor()
    try:
        query = "INSERT INTO login (name, username, password, type) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (name, username, password, type))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except:
        cursor.close()
        conn.close()
        return False

def get_video_name():
    conn = initialize_database(host=HOST, user=USER, password=PASSWORD, database=DATABASE)
    cursor = conn.cursor()
    query = "SELECT COALESCE(MAX(id), 0) as highest_id FROM audios;"
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result[0][0] + 1

def insert_audio(path, url):
    conn = initialize_database(host=HOST, user=USER, password=PASSWORD, database=DATABASE)
    cursor = conn.cursor()
    try:
        query = "INSERT INTO audios (path, url) VALUES (%s, %s)"
        cursor.execute(query, (path, url))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except IntegrityError:
        cursor.close()
        conn.close()
        return False
    
def segment_per_user():
    conn = initialize_database(host=HOST, user=USER, password=PASSWORD, database=DATABASE)
    cursor = conn.cursor()
    query = """
        SELECT 
            l.username, 
            COUNT(a.audio_name) as segment_count
        FROM 
            login l
        LEFT JOIN 
            audio_segments a ON l.username = a.username
        WHERE
            l.type = 'user'
        GROUP BY 
            l.username;
    """
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return dict(result)
    
def insert_segment(segment_data):
    conn = initialize_database(host=HOST, user=USER, password=PASSWORD, database=DATABASE)
    try:
        cursor = conn.cursor()
        query = "INSERT INTO audio_segments (audio_name, username, transcription, start_time, end_time) VALUES (%s, %s, %s, %s, %s)"
        cursor.executemany(query, segment_data)
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except:
        cursor.close()
        conn.close()
        return False
    
def get_user_data(username, offset):
    conn = initialize_database(host=HOST, user=USER, password=PASSWORD, database=DATABASE)
    cursor = conn.cursor()
    query = """
    SELECT 
        id,  
        audio_name, 
        transcription, 
        start_time, 
        end_time, 
        done, 
        delete_audio
    FROM audio_segments
    WHERE username = %s
    LIMIT 10 OFFSET %s;
    """
    cursor.execute(query, (username, offset))
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

def get_json_data(username):
    conn = initialize_database(host=HOST, user=USER, password=PASSWORD, database=DATABASE)
    cursor = conn.cursor()
    query = """
    SELECT 
        id,  
        audio_name, 
        transcription, 
        start_time, 
        end_time, 
        done, 
        delete_audio
    FROM audio_segments
    WHERE username = %s
    """
    cursor.execute(query, (username, ))
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

def get_page_count(username):
    conn = initialize_database(host=HOST, user=USER, password=PASSWORD, database=DATABASE)
    cursor = conn.cursor()
    query = """
    SELECT COUNT(username) AS count
    FROM audio_segments
    WHERE username = %s
    GROUP BY username;
    """
    cursor.execute(query, (username, ))
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    if len(result) == 0:
        return [[1]]
    return result
    
def get_user_audios(username):
    conn = initialize_database(host=HOST, user=USER, password=PASSWORD, database=DATABASE)
    cursor = conn.cursor()
    query = """
    SELECT DISTINCT audio_name
    FROM audio_segments
    WHERE username = %s;
    """
    cursor.execute(query, (username, ))
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

def update_audio(data):
    conn = initialize_database(host=HOST, user=USER, password=PASSWORD, database=DATABASE)
    cursor = conn.cursor()
    query = """
    UPDATE audio_segments
    SET 
        audio_name = %s,
        username = %s,
        transcription = %s,
        start_time = %s,
        end_time = %s,
        done = %s,
        delete_audio = %s
    WHERE id = %s;
    """
    cursor.execute(query, data)
    conn.commit()
    cursor.close()
    conn.close()

def get_all_users():
    conn = initialize_database(host=HOST, user=USER, password=PASSWORD, database=DATABASE)
    cursor = conn.cursor()
    query = "SELECT username, name FROM login"
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

def get_done_count(username):
    result = {}
    conn = initialize_database(host=HOST, user=USER, password=PASSWORD, database=DATABASE)
    cursor = conn.cursor()
    query = """
    SELECT COUNT(*) 
    FROM audio_segments
    WHERE username = %s AND done = 0;
    """
    cursor.execute(query, (username, ))
    result[0] = cursor.fetchall()[0][0]
    query = """
    SELECT COUNT(*) 
    FROM audio_segments
    WHERE username = %s AND done = 1;
    """
    cursor.execute(query, (username, ))
    result[1] = cursor.fetchall()[0][0]
    cursor.close()
    conn.close()
    return result
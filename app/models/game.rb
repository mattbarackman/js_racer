class Game < ActiveRecord::Base

  has_and_belongs_to_many :players
  before_save :set_time_to_win

  def set_time_to_win
    self.time_to_win = Time.now - self.created_at unless self.created_at.nil?
  end

end
